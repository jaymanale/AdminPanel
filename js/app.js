function dataService(dataType){

    var thePromise = new Promise(function(resolve, reject) {
        var Employees = Parse.Object.extend('Employees');
        var query = new Parse.Query(Employees);

        if (dataType == 'ALL') {
            query.find({
                success: function(results) {
                    resolve(results);


                },
                error: function(error) {
                    reject(error);
                    alert('Data Error :' + error);
                }
            });
        } else {
            query.get( dataType, {
                success: function(results) {
                    resolve(results);


                },
                error: function(object,error) {
                    reject(error);
                    alert('Data Error :' + error);
                }
            });


        }



    });

    return thePromise;

}



function editEmployee(id){
    dataService(id).then(function(result){
           navigatePages('#edit', result);
    });

}

function updateEmployee(id){
    var vendorShopNo = $('#vendorShopNo').val();
    var Rice = $('#Rice').val();
    var Wheat = $('#Wheat').val();
    var Sugar = $('#Sugar').val();
    var RiceFair = $('#RiceFair').val();
    var WheatFair = $('#WheatFair').val();
    var SugarFair = $('#SugarFair').val();

     dataService(id).then(function(result){

        result.set('vendorShopNo', vendorShopNo);
        result.set('Rice', Rice);
        result.set('Wheat', Wheat);
        result.set('Sugar', Sugar);

        result.set('RiceFair', RiceFair);
        result.set('WheatFair', WheatFair);
        result.set('SugarFair', SugarFair);

        result.save();

        location.reload();

     });

}


function deleteEmployee(id){

    dataService(id).then(function(result){
        result.destroy({
            success: function(result) {

                alert('Delete Record ID : ' + result.id);
                location.reload();

            },
            error: function(result, error) {
                alert('Delete Failed, error: ' + error);
            }
        });
    });
}











function registerUser () {

    var theUser = $('#username').val();
    var pass1 = $('#password').val();
    var pass2 = $('#password2').val();

    if (pass1 !== pass2) {
        alert('Passwords do not match, try again');
    } else {

        var newUser = new Parse.User();

        newUser.set('username', theUser);
        newUser.set('password', pass1);
        newUser.set('email', theUser);

        newUser.signUp(null, {
            success: function(user) {
                alert('Registerd user :' + theUser);
                navigatePages('#login');
            },
            error: function(user, error) {
                alert('Error: ' + error.code + ' ' + error.message);
            }
        });

    }

}

function logOff () {
    Parse.User.logOut();
    alert('Logged out!');
    navigatePages('#login');
}


function logOn () {
	var myUser = $('#username').val();
    var myPass = $('#password').val();

    Parse.User.logIn(myUser, myPass, {
        success: function(user) {
            alert('Logging in ' + myUser);

            dataService('ALL').then(function(result){
                navigatePages('#home', result);
            });

        },
        error: function(user,error) {
            alert('Error: ' + error.code + ' ' + error.message);
        }
    });
}

function addEmp () {

	var vendorShopNo = $('#vendorShopNo').val();
    var Rice = $('#Rice').val();
    var Wheat = $('#Wheat').val();
    var Sugar = $('#Sugar').val();
      var RiceFair = $('#RiceFair').val();
      var WheatFair = $('#WheatFair').val();
      var SugarFair = $('#SugarFair').val();
    // var employeePhoto = $('#employeePhoto')[0];
    //
    // var tmpPic = employeePhoto.files[0];
    // var tmpName = 'employeePhoto.jpg';
    //
    // var myImage = new Parse.File(tmpName, tmpPic);

    // myImage.save().then(function() {
    //     console.log('Saved image for employee ' + employeeFirstName + '' + employeeLastName);
    // },
    // function(error) {
    //     alert('could not save image beacuse of ' + error);
    // });

    var NewEmp = Parse.Object.extend('Employees');
    var newEmployee = new NewEmp();

    newEmployee.set('vendorShopNo', vendorShopNo);
    newEmployee.set('Rice', Rice);
    newEmployee.set('Wheat', Wheat);
    newEmployee.set('Sugar', Sugar);
    newEmployee.set('RiceFair', RiceFair);
    newEmployee.set('WheatFair', WheatFair);
    newEmployee.set('SugarFair', SugarFair);

    // newEmployee.set('employeePhoto', myImage);

     newEmployee.save(null, {
        success: function(obj) {
          // change id with shop number
            alert('New Record created with objectId: ' + obj.id);
            location.reload();
        },
        error: function(obj, error) {
            alert('Failed to create new Record, with error code: ' + error.message);

        }
    });


}












function navigatePages (temp, obj) {

    var theView;
    var template = $(temp).html();

    if (obj){
        theView = Mustache.render(template, obj);
    } else {
        theView = Mustache.render(template);
    }

    $('.template-view').html(theView);

    if (temp == '#login') {
        $('#loginButton').click(logOn);
        $('#signUpButton').click(function() {
            navigatePages('#sign-up');
        });
    }

    if (temp == '#sign-up') {
        $('#registerButton').click(registerUser);
        $('#cancelButton').click(function() {
            navigatePages('#login');
        });
    }

    if (temp == '#home') {
        $('#logout').click(logOff);
        $('#addNew').click(function() {

            navigatePages('#add');
        });
    }

    if (temp == '#add') {
        $('#addEmployee').click(addEmp);
        $('#cancelButton').click(function() {
            // navigatePages('#home');
            location.reload();
        });
    }

    if (temp == '#edit') {
      // $('#updateEmployee').click(updateEmployee);
        $('#cancelButton').click(function() {
            location.reload();
        });
    }


}



window.onload = function() {

    init();


};

function init () {

    Parse.initialize("AUY7bCJWAoFpnDwTqJs0jR3Q4xBKJFnzW51gMfuD","PYUlZkDYXYOLwwTybLP9gwsyTMqTIXd9hRZCKtCk");
    // Parse.serverURL = 'heroku server URL goes here';

    var userLoggedIn = Parse.User.current();


    if (userLoggedIn){

        dataService('ALL').then(function(result){
                navigatePages('#home', result);
        });

    } else {

        navigatePages('#login');

    }
}
