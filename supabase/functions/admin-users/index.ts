
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.9'
import { corsHeaders } from '../_shared/cors.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Admin function called with method:', req.method)
    
    // Verify the user is authenticated first
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      console.error('No authorization header')
      return new Response(
        JSON.stringify({ success: false, error: 'No authorization header' }),
        { 
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
    if (authError || !user) {
      console.error('Authentication failed:', authError)
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized' }),
        { 
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Get user role from metadata
    const userRole = user.user_metadata?.role || 'master' // Default to master for testing
    console.log('User role:', userRole)

    // Parse JSON body
    let requestData
    try {
      const bodyText = await req.text()
      console.log('Raw body:', bodyText)
      
      if (!bodyText || bodyText.trim() === '') {
        // If no body, assume it's a fetchAllUsers request
        requestData = { action: 'fetchAllUsers' }
      } else {
        requestData = JSON.parse(bodyText)
      }
      
      console.log('Parsed request data:', requestData)
    } catch (error) {
      console.error('JSON parsing error:', error)
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid JSON format in request body' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const { action, ...data } = requestData
    console.log('Action:', action, 'Data:', data)

    if (!action) {
      console.error('No action specified')
      return new Response(
        JSON.stringify({ success: false, error: 'Action is required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    switch (action) {
      case 'createUser': {
        const { email, password, name, role } = data
        
        if (!email || !password || !name || !role) {
          return new Response(
            JSON.stringify({ success: false, error: 'Missing required fields: email, password, name, role' }),
            { 
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          )
        }
        
        console.log('Creating user:', email, 'with role:', role)

        const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: {
            name,
            role
          }
        })

        if (createError) {
          console.error('Error creating user:', createError)
          return new Response(
            JSON.stringify({ success: false, error: createError.message }),
            { 
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          )
        }

        // Create profile entry
        const { error: profileError } = await supabaseAdmin
          .from('profiles')
          .insert({
            id: newUser.user.id,
            name
          })

        if (profileError) {
          console.error('Error creating profile:', profileError)
        }

        return new Response(
          JSON.stringify({ success: true, user: newUser.user }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'fetchAllUsers': {
        console.log('Fetching all users')
        
        // Buscar todos os usuários autenticados
        const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers()

        if (authError) {
          console.error('Error fetching auth users:', authError)
          return new Response(
            JSON.stringify({ success: false, error: authError.message }),
            { 
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          )
        }

        console.log('Found auth users:', authUsers.users.length)

        // Buscar perfis existentes
        const userIds = authUsers.users.map(u => u.id)
        let profiles = []
        
        if (userIds.length > 0) {
          const { data: profilesData, error: profileError } = await supabaseAdmin
            .from('profiles')
            .select('id, name')
            .in('id', userIds)

          if (profileError) {
            console.error('Error fetching profiles:', profileError)
          } else {
            profiles = profilesData || []
          }
        }

        // Mapear usuários com seus perfis
        const users = authUsers.users.map(authUser => {
          const profile = profiles.find(p => p.id === authUser.id)
          const role = authUser.user_metadata?.role || 'representante'
          
          // Use o nome do perfil se existir, senão use o nome do metadata, senão use o email
          let userName = profile?.name || authUser.user_metadata?.name
          if (!userName && authUser.email) {
            userName = authUser.email.split('@')[0]
          }
          if (!userName) {
            userName = 'Usuário'
          }
          
          return {
            id: authUser.id,
            name: userName,
            email: authUser.email || '',
            role
          }
        })

        console.log('Mapped users:', users.length)

        return new Response(
          JSON.stringify({ success: true, users }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'updateUserRole': {
        const { userId, newRole } = data
        
        if (!userId || !newRole) {
          return new Response(
            JSON.stringify({ success: false, error: 'Missing required fields: userId, newRole' }),
            { 
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          )
        }
        
        console.log('Updating user role:', userId, 'to:', newRole)

        // Check if target user exists
        const { data: targetUser } = await supabaseAdmin.auth.admin.getUserById(userId)
        if (!targetUser?.user) {
          return new Response(
            JSON.stringify({ success: false, error: 'User not found' }),
            { 
              status: 404,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          )
        }

        const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
          user_metadata: { 
            ...targetUser.user.user_metadata,
            role: newRole 
          }
        })

        if (error) {
          console.error('Error updating user role:', error)
          return new Response(
            JSON.stringify({ success: false, error: error.message }),
            { 
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          )
        }

        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      default:
        console.error('Invalid action:', action)
        return new Response(
          JSON.stringify({ success: false, error: `Invalid action: ${action}` }),
          { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
    }
  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
