# project2

The Record Shop

A full-stack application using Node.js, Mongoose, Express, and EJS.
Includes 7 RESTFUL routes and full CRUD.
Created two models to create inventory and user databases.
Log In functionality, with encrypted passwords, and authorization flow.

GitHub: https://github.com/Tinagrissom/project2
Heroku: https://tinagproject2.herokuapp.com/

On load of the homepage a modal will display using jQuery and will allow users to sign-up for our newsletter.

A navigation bar at the top of the page will allow users to return Home, Create an Account, or to Log In. There is a cart logo that will eventually serve as a link to the users cart.

The homepage includes a flexed display of a thumbnail image of the record, the name of the album, and the artist.

When the user clicks the image of the album, they are redirected to a show page. The show page is available for each record and includes a description, of the album title, artist, genre, price by competitors, the shops discounted price, and how many are in-stock. A button will allow the users to "add to cart". This button's functionality will remove one item from the quantity in stock. If there are 0 items in stock, this button will not appear and will instead have the text "OUT OF STOCK".

The footer includes a navigation with options to Create a New Item, Edit an existing item, or Delete an item.

Things I would like to continue to improve:
1. Make the cart functional
2. Have the newsletter modal only appear once 
