function addRoom() {
    const roomItem = document.querySelector('.room-item');
    const clone = roomItem.cloneNode(true);
    document.getElementById('roomsContainer').appendChild(clone);
}

function addFacility() {
    const facilityItem = document.querySelector('.facility-item');
    const clone = facilityItem.cloneNode(true);
    document.getElementById('facilitiesContainer').appendChild(clone);
}

document.getElementById('propertyForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const form = event.target;
    const data = {
        property: {
            place: form.place.value,
            pincode: form.pinCode.value,
            area: form.area.value,
            bathRooms: form.bathroom.value === 'yes' ? 1 : 0,
            bedrooms: [],
            facility: []
        }
    };

    const rooms = document.querySelectorAll('.room-item');
    rooms.forEach(room => {
        data.property.bedrooms.push({
            area: room.querySelector('input[name="roomArea"]').value,
            roomType: room.querySelector('select[name="roomType"]').value,
            attachedBathrrom: room.querySelector('input[name="attachedBathroom"]').value,
            image: room.querySelector('input[name="roomImage"]').value
        });
    });

    const facilities = document.querySelectorAll('.facility-item');
    facilities.forEach(facility => {
        data.property.facility.push({
            facType: {
                type: facility.querySelector('input[name="facilityType"]').value,
                distance: facility.querySelector('input[name="facilityDistance"]').value
            },
            desc: facility.querySelector('input[name="facilityDesc"]').value
        });
    });

    console.log(JSON.stringify(data, null, 2));


    const jwtToken = localStorage.getItem('jwt');

    try {
        let response = await fetch('http://localhost:5000/api/seller/property/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            let result = await response.json();
            console.log(result);

            window.location.href = './displyProperties.html';
        } else {
            let data = await response.json();
            throw new Error(data.message || 'Registration failed');
        }
    } catch (error) {
        console.error('Error:', error);
        alert(error.message || 'Registration failed.');
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
