# Be sure to restart your server when you modify this file.

# Your secret key for verifying cookie session data integrity.
# If you change this key, all old sessions will become invalid!
# Make sure the secret is at least 30 characters and all random, 
# no regular words or you'll be exposed to dictionary attacks.
ActionController::Base.session = {
  :key         => '_dalli_session',
  :secret      => '1f4b08dd7635aa75f3d1c77bc396eed2305998d8eaf66f1d7a0a3ba1cf9a945e2df362c11d613454b7a9bf8a73e25f71b69dc39ad8fe1d3cd0e48920525b8f37'
}

# Use the database for sessions instead of the cookie-based default,
# which shouldn't be used to store highly confidential information
# (create the session table with "rake db:sessions:create")
# ActionController::Base.session_store = :active_record_store
