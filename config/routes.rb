Rails.application.routes.draw do
  
  get "/" => redirect("/pages/home")

  get 'pages/home'
  
  get 'pages/price'

  get 'pages/contact'

  get 'pages/about'

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
