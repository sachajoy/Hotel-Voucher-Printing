var myapp = angular.module('shailesh_banthia',[]);
//directive for only text to be enterd
(function() {

    myapp.directive('onlyLettersInput', onlyLettersInput);

    function onlyLettersInput() {
        return {
            require: 'ngModel',
            link: function(scope, element, attr, ngModelCtrl) {
                function fromUser(text) {
                    var transformedInput = text.replace(/[^a-zA-Z]/g, '');
                    //console.log(transformedInput);
                    if (transformedInput !== text) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }
                    return transformedInput;
                }
                ngModelCtrl.$parsers.push(fromUser);
            }
        };
    };

})();
//CONTROLLER FOR THE VOUCHER HTML
myapp.controller('voucher', function ($scope,$http) {
    
    console.log("voucher");
    //VARIABLE OF HOTEL LIST
    $scope.hotel_mst = JSON.parse(localStorage.getItem('hotel_list'));
    $scope.meal_plan = JSON.parse(localStorage.getItem('meal_plan'));
    $scope.name_title = JSON.parse(localStorage.getItem('name_title'));
    // console.log($scope.hotel_mst);
    // console.log($scope.meal_plan);
    // console.log($scope.name_title);

    //VARIABLE TO STORE ALL THE DATA OF THE VOUCHER
    $scope.voucher = [];
    //VARIABLE TO STORE ALL THE DATA OF THE VOUCHER GUEAT NAME

    // $scope.voucher.guest_list = [];
    //FUNCTION TO ADD THE TEXT BOX AND ADD THE ROOM LIST
    $scope.add_rooms = function () {
        $scope.voucher.guest_list = [];
        $scope.voucher.guest_list.name_list = [];
        $scope.voucher.room_type = [];
        $scope.voucher.guest_type =[];
        // console.log($scope.voucher);
        // $scope.voucher.guest_list.push({ name : ''});
        // //console.log($scope.guest_list)
        var i =0;
        //COUTN THE NO OF ROOM
        var count = parseInt($scope.voucher.room_count);
        // console.log("fun to add room called");
        // console.log(parseInt($scope.voucher.room_count));
        //LOOP TO ADD THE NO OF ROOMS
        while(i < count){
            // console.log(i)
            $scope.voucher.room_type.push({ room_no : i+1,room_name : '' });
            $scope.voucher.guest_list.push({ room : i+1, name_list:[{name:"",cat:""},{name:"", cat:""},{name:"",cat:""},{name:"",cat:""}]});
            $scope.voucher.guest_type.push({ type : ''});
            // $scope.voucher.room_type.push({ room_name : '' });
            i++;
        }
    }

    //METHOD TO ADD THE GUEST OF IN THE ROOM
    $scope.add_guest = function (room_no) {

        console.log(room_no);
        //onsole.log($scope.voucher.guest_list[room_no-1].name_list[])
        console.log(Object.keys($scope.voucher.guest_list[room_no-1].name_list).length);
        var count = Object.keys($scope.voucher.guest_list[room_no-1].name_list).length;
        $scope.voucher.guest_list[room_no-1].name_list = [];
        $scope.voucher.guest_list[room_no-1].name_list[count].push({name:''});
    }
    //    TEST FUNCTION

    $scope.test = function () {
        console.log($scope.voucher);
    }
    $scope.room_no = function (room_no) {
        console.log(room_no)
        console.log(parseInt($scope.voucher.guest_list[room_no-1]));

    }

});
//CONTROLLER FOR THE DASHBOARD JS
myapp.controller('dashboard',function ($scope,$http) {
    console.log("dashboard");
});
myapp.controller('login',function ($scope,$http) {
    console.log("login made");
    $scope.login = function () {
        //console.log($scope.loginDetails);
        $http.post("php/login.php",$scope.loginDetails).then(function (res) {
            console.log(res.data);
            if (res.data == 1) {
                window.location = "dashboard.html";
                $http.get("php/hotel_list.php").then(function (value) {
                    localStorage.setItem('hotel_list', JSON.stringify(value.data.hotel_list));
                    localStorage.setItem('meal_plan', JSON.stringify(value.data.meal_plan));
                    localStorage.setItem('name_title', JSON.stringify(value.data.name_title));
                })
            }else{
                alert("username or password may be incorrect");
            }
        })
    }

})