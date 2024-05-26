
  // Retrieve JWT token from local storage
  const token = localStorage.getItem('jwt');
  const isSeller = localStorage.getItem('isSeller')

  // Function to handle 'like' button click
function handleLikeButtonClick(propertyId) {
    $.ajax({
      url: 'http://localhost:5000/api/buyer/like',
      type: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token
      },
      data: JSON.stringify({ propId: propertyId }),
      contentType: 'application/json',
      success: function(response) {
        // Handle success
        alert('Property liked successfully!');
      },
      error: function(xhr, status, error) {
        // Handle error
        console.error('Error:', error);
      }
    });
  }
  
  // Function to handle 'interested' button click
  function handleInterestedButtonClick(propertyId) {
    $.ajax({
      url: 'http://localhost:5000/api/buyer/interest',
      type: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token
      },
      data: JSON.stringify({ propId: propertyId }),
      contentType: 'application/json',
      success: function(response) {
        // Handle success
        alert('Marked property as interested successfully!');
      },
      error: function(xhr, status, error) {
        // Handle error
        console.error('Error:', error);
      }
    });
  }
  

  // Function to handle 'edit' button click
  function handleEditButtonClick(propertyId) {
    // Perform edit action here (e.g., redirect to edit property page)
    alert('Editing property with ID: ' + propertyId);
  }

  // Make GET request to fetch properties
  $.ajax({
    url: 'http://localhost:5000/api/buyer/properites',
    type: 'GET',
    headers: {
      'Authorization': 'Bearer ' + token
    },
    success: function(response) {
      // Process the received properties
      response.forEach(property => {
        let roomDetails = "";
        let roomImage = "";
        Object.keys(property.rooms).forEach(key => {
          if (!roomImage)
            roomImage = property.rooms[key][0].image;
          roomDetails += key + " " + property.rooms[key].length + ", ";
        });

        let facilityDetails = "";
        property.facility.forEach(element => {
          facilityDetails += element.facType + " " + element.desc + ", " + element.distance + " ";
        });

        // Generate HTML for each property card
        var cardHtml = `
          <div class="col-md-6">
            <div class="card" data-property-id="${property.propId}">
              <img src="${roomImage}" class="card-img-top" alt="Room Image">
              <div class="card-body">
                <h5 class="card-title">Property Details</h5>
                <p class="card-text">Place: ${property.place}</p>
                <p class="card-text">Pincode: ${property.pincode}</p>
                <p class="card-text">${property.area}</p>
                <p class="card-text">Rooms: ${roomDetails}</p>
                <p class="card-text">Facility: ${facilityDetails}</p>
                <p class="card-text">Seller Name: ${property.sellerName}</p>
                ${property.sellerNumber && property.sellerNumber.length > 0 ? '<p class="card-text">Seller Mobile: ' + property.sellerNumber + '</p>' : ''}
                <!-- Buttons -->  </div>`
            if(isSeller == "1"){
                cardHtml += `${token ? ` <div class="card-footer d-flex justify-content-between"> 
                <button class="btn btn-primary btn-edit" data-property-id="${property.propId}">Edit</button> </div>` : ''}`
            }
            else{
               cardHtml += `<div class="card-footer d-flex justify-content-between">
               <span class="like-group">
               <button class="btn btn-like ${property.isLiked === "Yes" ? 'btn-liked' : ''}" data-property-id="${property.propId}"><span class="material-symbols-sharp">
               thumb_up
               </span></button>${property.totalLike}
               </span>
               
               <button class="btn btn-primary btn-interested ${property.sellerNumber ? '' : 'disabled'}" data-property-id="${property.propId}"><span class="material-symbols-sharp">
               favorite
               </span></button>
             </div>`
            }
                // <button class="btn btn-primary btn-like" data-property-id="${property.propId}">Like</button>
                // <button class="btn btn-primary btn-interested" data-property-id="${property.propId}">Interested</button>
                // ${token ? `<button class="btn btn-primary btn-edit" data-property-id="${property.propId}">Edit</button>` : ''}
            cardHtml += `
                </div>
            </div>
            `;

        // Append the card to the container
        $('#property-cards').append(cardHtml);
      });
      

      // Event handling for buttons
      $('.btn-like').click(function() {
        var propertyId = $(this).data('property-id');
        handleLikeButtonClick(propertyId);
      });

      $('.btn-interested').click(function() {
        var propertyId = $(this).data('property-id');
        handleInterestedButtonClick(propertyId);
      });

      $('.btn-edit').click(function() {
        var propertyId = $(this).data('property-id');
        handleEditButtonClick(propertyId);
      });
    },
    error: function(xhr, status, error) {
      console.error('Error:', error);
    }
  });


  // Function to handle logout
  function logout() {
    if (localStorage.getItem('jwt')) {
      localStorage.removeItem('jwt');
      // Redirect to the logout page or perform any other logout actions
    } else {
      // Redirect to the login page if there's no token
      window.location.href = 'index.html'; // Replace 'login.html' with your login page URL
    }
  }

  // Function to check if token exists
  (function () {
    if(localStorage.getItem('jwt') == null){
        window.location.href = 'index.html';
    }
})()


  // Function to check if token exists
function addProtertyBtn() {
    if(localStorage.getItem('isSeller') == "1"){
        let adBtn = `<a href="addProperty.html">Add Property</a>`
        $('#property-cards').append(adBtn);
    }
}
addProtertyBtn();