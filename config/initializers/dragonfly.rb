require 'dragonfly'

# Configure
Dragonfly.app.configure do
  plugin :imagemagick

  secret "3e79dc976d185de0cff91b5f9101b0e80541195e96815bbd54e80817404ff015"

  url_format "/media/:job/:name"
#public/system/dragonfly
  datastore :file,
    root_path: Rails.root.join('ng-app/app/assets/resume', Rails.env),
    server_root: Rails.root.join('ng-app')
end

# Logger
Dragonfly.logger = Rails.logger

# Mount as middleware
Rails.application.middleware.use Dragonfly::Middleware

# Add model functionality
if defined?(ActiveRecord::Base)
  ActiveRecord::Base.extend Dragonfly::Model
  ActiveRecord::Base.extend Dragonfly::Model::Validations
end
