var myapp = angular.module('shailesh_banthia', []);
//directive for only text to be enterd
(function () {

    myapp.directive('onlyLettersInput', onlyLettersInput);

    function onlyLettersInput() {
        return {
            require: 'ngModel',
            link: function (scope, element, attr, ngModelCtrl) {
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
myapp.controller('voucher', function ($scope, $http, $rootScope, $filter) {


    console.log("voucher");
    $http.get("php/client_list.php").then(function (value) {
        $scope.client_list = value.data;
        console.log($scope.client_list);
    });
    $http.get("php/hotel_list.php").then(function (value) {
        $scope.hotel_mst = value.data.hotel_list;
        console.log(value.data);
    });
    //VARIABLE OF HOTEL LIST
    // $rootScope.hotel_mst = JSON.parse(localStorage.getItem('hotel_list'));
    //$rootScope.meal_plan = JSON.parse(localStorage.getItem('meal_plan'));
    //$rootScope.name_title = JSON.parse(localStorage.getItem('name_title'));
    // console.log($scope.hotel_mst);
    // console.log($scope.meal_plan);
    // console.log($scope.name_title);
    //FUNCTION TO ADD THE TEXT BOX AND ADD THE ROOM LIST
    $scope.add_rooms = function () {

        $scope.voucher.room_det = [];
        $scope.voucher.room_types = [];
        // console.log($scope.voucher);
        // $scope.voucher.guest_list.push({ name : ''});
        // //console.log($scope.guest_list)
        var i = 0;
        //COUTN THE NO OF ROOM
        var count = parseInt($scope.voucher.room_count);
        // console.log("fun to add room called");
        // console.log(parseInt($scope.voucher.room_count));
        //LOOP TO ADD THE NO OF ROOMS
        while (i < count) {
            // console.log(i)
            $scope.voucher.room_types.push({room_no: i + 1, room_name: ''});
            $scope.voucher.room_det.push({
                room: "", meal_plan: "",
                name_list: [{name: "", cat: "", age: 0}, {name: "", cat: "", age: 0}, {
                    name: "",
                    cat: "",
                    age: 0
                }, {name: "", cat: "", age: 0}],
                ext_bed: 0
            });
            // $scope.voucher.room_type.push({ room_name : '' });
            i++;
        }
    }
    //    submit the form data to php and insert into db
    $scope.submit_form_data = function () {
        if ($scope.voucher.child_count == undefined || $scope.voucher.child_count == null) {
            $scope.voucher.child_count = 0;
        }
        if ($scope.voucher.inclusion == undefined) {
            $scope.voucher.inclusion = " ";
        }
        if ($scope.voucher.htl_bk_id == undefined) {
            $scope.voucher.htl_bk_id = " ";
        }
        if ($scope.voucher.bk_id == undefined) {
            $scope.voucher.bk_id = " ";
        }
        if ($scope.voucher.remarks == undefined) {
            $scope.voucher.remarks = " ";
        }

        if ($scope.voucher.cancel_pol == undefined) {
            $scope.voucher.cancel_pol = " ";
        }
        $scope.voucher.total = $scope.voucher.adult_count + $scope.voucher.child_count;

        if ($scope.voucher.shoeRommDet) {
            $scope.voucher.guestPresent = 1;
        } else {
            $scope.voucher.guestPresent = 0;
        }

        console.log($scope.voucher);
        $scope.voucher.chk_in_date = $filter('date')($scope.voucher.chk_in_date, "yyyy-MM-dd");
        $scope.voucher.chk_out_date = $filter('date')($scope.voucher.chk_out_date, "yyyy-MM-dd");
        $scope.voucher.booking_date = $filter('date')($scope.voucher.booking_date, "yyyy-MM-dd");
        console.log($scope.voucher.chk_in_date);
        // console.log("json_output : "+JSON.stringify($scope.voucher))
        $http.post("php/insert_hotel_voucher.php", $scope.voucher).then(function (res) {
            console.log(res.data);
            if (res.data == 1) {
                alert("data has been inserted");
                $scope.voucher = null;
            } else {
                alert("there is somethig nt correct");
            }
        })

    }
    $scope.room_no = function (room_no) {
        console.log(room_no)
        console.log(parseInt($scope.voucher.guest_list[room_no - 1]));

    }

});
//CONTROLLER FOR THE DASHBOARD JS
myapp.controller('dashboard', function ($scope, $http) {
    console.log("dashboard");
});
//CONTROLLER FOR LOGIN
myapp.controller('login', function ($scope, $http) {
    console.log("login made");
    $scope.login = function () {
        //console.log($scope.loginDetails);
        console.log($scope.loginDetails);
        $http.post("php/login.php", $scope.loginDetails).then(function (res) {
            console.log(res);
            if (res.data == 1) {
                $http.get("php/hotel_list.php").then(function (value) {
                    localStorage.setItem('hotel_list', JSON.stringify(value.data.hotel_list));
                    // localStorage.setItem('meal_plan', JSON.stringify(value.data.meal_plan));
                    // localStorage.setItem('name_title', JSON.stringify(value.data.name_title));
                    // localStorage.setItem('city_det', JSON.stringify(value.data.city));
                    window.location = "dashboard.html";
                })
            } else {
                alert("username or password may be incorrect");
            }
        })
    }

});
//CONTOLLER FOR THE ADD HOTEL
myapp.controller('add_hotel', function ($scope, $http, $rootScope) {
    console.log("add_hotel");
    $scope.city_det = JSON.parse(localStorage.getItem('city_det'));
    $scope.phn_no = [];
    $scope.mail = [];
    $scope.contact = [];
//function to add the new phnone no
    $scope.add_phn = function () {
        console.log("function caleed" + $scope.phn_no);
        $scope.phn_no.push({num: ''});
    };
    $scope.add_mail = function () {
        console.log("add mai; ca;;ed")
        $scope.mail.push({mail: ''});
    };
    $scope.add_contact = function () {
        $scope.contact.push({name: '', remarks: '', phn_no: '', email: ''});
    };
    $scope.submit_form_data = function () {
        console.log("submit_form_data function")
        console.log($scope.newHotel);
        $scope.newHotel.phn_no = $scope.phn_no;
        $scope.newHotel.mail = $scope.mail;
        $scope.newHotel.contact = $scope.contact;
        $http.post('php/insert_hotel_data.php', $scope.newHotel).then(function (value) {
            console.log(value.data);
            if (value.data.action == 1) {
                alert("NEW HOTEL HAS BEEN CREATED NAMED : " + $scope.newHotel.xname);
                localStorage.setItem('hotel_list', JSON.stringify(value.data.hotel));
                $scope.newHotel = null;
                $scope.phn_no = [];
                $scope.contact = [];
                $scope.mail = [];
            }
            else {
                alert("CHECK YOU HAVE LEFT ONE OR MORE DATA FIELD EMPTY");
            }
        });
    };

});
//CONTROLLER TO ADD THE FIRM
myapp.controller('add_firm', function ($scope, $http) {
    console.log("add_firm");
    var define = function () {
        $scope.cust_name = [];
        $scope.mobile_no = [];
        $scope.email_id = [];
    }
    define();
    $scope.add_cust = function () {
        $scope.cust_name.push({name: ''})
    };
    $scope.add_mob = function () {
        $scope.mobile_no.push({name: ''})
    };
    $scope.add_mail = function () {
        $scope.email_id.push({name: ''})
    };
    $scope.submit_form_data = function () {
        $scope.firm.cust_name = $scope.cust_name;
        $scope.firm.mob_no = $scope.mobile_no;
        $scope.firm.email_id = $scope.email_id;
        console.log($scope.firm);
        console.log($scope.cust_name);
        $http.post("php/insert_firm_det.php", $scope.firm).then(function (value) {
            console.log(value.data);
            if (value.data.success == 1) {
                alert("New Firm Created Named : " + $scope.firm.xname);
                $scope.firm = null;
                $scope.cust_name = [];
                $scope.mobile_no = [];
                $scope.email_id = [];
            } else {
                alert("you have left one or other feild blank or exceed the limit of no ");
            }
        });
    }

});
//CONTROLLER TO ADD THE CLIENT FOR PASSPORT
myapp.controller('add_client', function ($scope, $http, $filter) {
    console.log("add client")
    $scope.airline_det = [];
    $scope.add_airline_det = function () {
        console.log("airlines called")
        $scope.airline_det.push({name: "", mem: "", pass: ""});
    };
//method to submit the form data server
    $scope.submit_form_data = function () {
        //declaring all the objects which are not defined
        if ($scope.client.m_name == undefined)
            $scope.client.m_name = " ";
        if ($scope.client.pass_no == undefined)
            $scope.client.pass_no = " ";
        if ($scope.client.place_of_birth == undefined)
            $scope.client.place_of_birth = " ";
        if ($scope.client.place_of_issue == undefined)
            $scope.client.place_of_issue = " ";
        if ($scope.client.exp_date == undefined)
            $scope.client.exp_date = $filter('date')(new Date("1000-01-01"), 'yyyy-MM-dd');
        if ($scope.client.gender == undefined)
            $scope.client.gender = " ";
        if ($scope.client.fname == undefined)
            $scope.client.fname = " ";
        if ($scope.client.mname == undefined)
            $scope.client.mname = " ";
        if ($scope.client.title == undefined)
            $scope.client.title = " ";
        if ($scope.client.gst_no == undefined)
            $scope.client.gst_no = " ";
        if ($scope.client.pan_no == undefined)
            $scope.client.pan_no = " ";
        if ($scope.client.email_id == undefined)
            $scope.client.email_id = " ";
        if ($scope.client.add1 == undefined)
            $scope.client.add1 = " ";
        if ($scope.client.add2 == undefined)
            $scope.client.add2 = " ";
        if ($scope.client.phn_no == undefined)
            $scope.client.phn_no = 00;
        if ($scope.client.airline_name == undefined)
            $scope.client.airline_name = " ";
        if ($scope.client.membership_no == undefined)
            $scope.client.membership_no = " ";
        if ($scope.client.mem_password == undefined)
            $scope.client.mem_password = " ";
        if ($scope.client.nation == undefined)
            $scope.client.nation = " ";
        if ($scope.client.spouse == undefined)
            $scope.client.spouse = " ";
        if ($scope.client.issue_date == undefined)
            $scope.client.issue_date = $filter('date')(new Date("1000-01-01"), 'yyyy-MM-dd');
        if ($scope.client.dob == null)
            $scope.client.dob = $filter('date')(new Date("1000-01-01"), 'yyyy-MM-dd');
        $scope.client.dob = $filter('date')($scope.client.dob, 'yyyy-MM-dd');
        $scope.client.airlines = $scope.airline_det;
        $scope.client.exp_date = $filter('date')($scope.client.exp_date, 'yyyy-MM-dd');
        $scope.client.issue_date = $filter('date')($scope.client.issue_date, 'yyyy-MM-dd');


        console.log($scope.client);
        $http.post("php/insert_customer_det.php", $scope.client).then(function (value) {
            console.log(value.data);
            if (value.data.success == 1) {
                alert("New client add with name : " + $scope.client.f_name);
                $scope.client = null;
                $scope.airline_det = [];
            } else {
                alert("there is something you left blank");
            }
        });
    }
});
//CONTRLLER TO VIEW HOTEl
myapp.controller('view_hotel', function ($scope, $http) {
    console.log('view hotel');
    $http.get("php/hotel_list.php").then(function (value) {
        console.log(value.data.hotel_list);
        $scope.hotel_mst = value.data.hotel_list;
    })
    // $scope.hotel_mst = JSON.parse(localStorage.getItem('hotel_list'));
    console.log($scope.hotel_mst);
    $scope.test = function (x) {
        console.log("test unction");
        console.log(x);
        $http.post("php/hotel_data.php", x.id).then(function (value) {
            console.log(value.data);
            $scope.hotel_data = value.data;
        });
        $scope.selecteddata = x;
        $scope.newHotel = x;
    }
    $scope.copyFunction = function (value) {
        console.log(value);
        var copyElement = document.createElement("textarea");
        copyElement.style.position = 'fixed';
        copyElement.style.opacity = '0';
        copyElement.textContent = value;
        var body = document.getElementsByTagName('body')[0];
        body.appendChild(copyElement);
        copyElement.select();
        document.execCommand('copy');
        body.removeChild(copyElement);
    }
//    function to upste the hoel mst
    $scope.update_hotel = function () {
        console.log("hello hotel");
        $http.post("php/update_hotel.php", $scope.newHotel).then(function (value) {
            console.log(value.data);
            if (value.data == 1) {
                alert("data updated")
                location.reload(true);
            } else
                alert("try again")
        })
    }
    $scope.add_contact = function () {
        $scope.contact.hotel_id = $scope.selecteddata.id;
        console.log($scope.contact);
        $http.post("php/add_new_hotel_contact.php", $scope.contact).then(function (value) {
            console.log(value.data)
            if (value.data == 1) {
                alert("contact added")
                location.reload(true);
            } else
                alert("try again with valid results");
        })
    }
    $scope.add_phn_no = function () {
        $scope.newphn_no.hotel_id = $scope.selecteddata.id;
        console.log($scope.newphn_no);
        $http.post("php/add_new_hotel_phn.php", $scope.newphn_no).then(function (value) {
            console.log(value.data)
            if (value.data == 1) {
                alert("new phone added")
                location.reload(true);
            } else
                alert("try again with valid results");
        })
    }
    $scope.add_mail = function () {
        $scope.newmail.hotel_id = $scope.selecteddata.id;
        console.log($scope.newmail);
        $http.post("php/add_new_hotel_mail.php", $scope.newmail).then(function (value) {
            console.log(value.data)
            if (value.data == 1) {
                alert("new email added")
                location.reload(true);
            } else
                alert("try again with valid results");
        })
    }
    $scope.remove_contact = function (x) {
        $http.post("php/drop_contact.php", x.id).then(function (value) {
            console.log(value.data);
            if (value.data == 1) {
                alert("contact deteled")
                location.reload(true);
            } else
                alert("try again");
        })
    }
    $scope.remove_phn = function (x) {
        console.log(x)
        $http.post("php/drop_phn.php", x.id).then(function (value) {
            console.log(value.data);
            if (value.data == 1) {
                alert("Phone Number deteled")
                location.reload(true);
            } else
                alert("try again");
        })
    }
    $scope.remove_mail = function (x) {
        $http.post("php/drop_mail.php", x.id).then(function (value) {
            console.log(value.data);
            if (value.data == 1) {
                alert("mail id deteled")
                location.reload(true);
            } else
                alert("try again");
        })
    }

});
//view hotel voucher contrller
myapp.controller('view_voucher', function ($scope, $http, $filter) {
    console.log('view vouchers');
    $http.get("php/hotel_voucher_data.php").then(function (value) {
        console.log(value.data);
        $scope.voucher_list = value.data;
    });
//    function to select the tran data of selected
    $scope.select_tran_data = function (value) {
        console.log(value)
        $scope.selected_tran_data = value;
        $http.get("php/client_list.php").then(function (value) {
            $scope.client_list = value.data;
            console.log($scope.client_list);
        });
        $http.get("php/hotel_list.php").then(function (value) {
            $scope.hotel_mst = value.data.hotel_list;
            console.log(value.data);
        });
        $scope.voucher = value;
        $scope.voucher.chk_in_date = new Date(value.chk_in_date);
        $scope.voucher.chk_out_date = new Date(value.chk_out_date);
        $scope.voucher.booking_date = new Date(value.booking_date);
        // $('#chk_in_date').val(value.chk_in_date);
        // $('#chk_out_date').val(value.chk_out_date);
        // $('#booking_date').val(value.booking_date);
        // $('#title').val(value.hotel_id);
        // $scope.voucher

    }
//    function for the guest
    $scope.select_tran_data_guest = function (value) {
        console.log(value)
        $scope.selected_tran_data = value;
        $scope.guest_list = [];
        $scope.guest_list.push({name: '', age: 0, cat: ''}, {name: '', age: 0, cat: ''}, {
            name: '',
            age: 0,
            cat: ''
        }, {name: '', age: 0, cat: ''});
    }
//    function to bring the data of the room from tran det table
    $scope.select_tran_det_data = function (value) {
        console.log(value);
        $scope.guest_list = null;
        $http.post("php/tran_det_data.php", value.tran_id).then(function (value2) {
            console.log(value2.data);
            $scope.selected_tran_det_data = value2.data;
            $scope.tran_det_data = value2.data;
        })
    }
//    get the guest list of all the tran det ids
    $scope.get_guest_list = function (value) {
        console.log(value);
        $http.post("php/guest_list_data.php", value.tran_det_id).then(function (value2) {
            console.log(value2.data);
            if (value2.data == 0) {
                $scope.show_guest_list = 0;
            } else {
                $scope.guest_list = value2.data;
                $scope.show_guest_list = 1;
            }
        })
    }
    $scope.print_data = function (value) {
        localStorage.setItem('tran_data', JSON.stringify(value));
    }

    $scope.print_page = function () {
        localStorage.setItem('print_data', JSON.stringify($scope.print));
        window.location = "print_voucher.html";
    }
//    update the tran details
    $scope.update_tran = function () {
        $scope.voucher.chk_in_date = $filter('date')($scope.voucher.chk_in_date, 'yyyy-MM-dd')
        $scope.voucher.chk_out_date = $filter('date')($scope.voucher.chk_out_date, 'yyyy-MM-dd')
        $scope.voucher.booking_date = $filter('date')($scope.voucher.booking_date, 'yyyy-MM-dd')
        console.log($scope.voucher);
        $http.post("php/update_tran.php", $scope.voucher).then(function (value) {
            console.log(value.data)
            if (value.data == 1) {
                alert("data Updated")
                location.reload(true);
            } else {
                alert("You cannot update this data")
            }
        })
    }
//    update the tran_det
    $scope.update_tran_det = function () {
        console.log($scope.tran_det_data)
        $http.post("php/update_tran_det.php", $scope.tran_det_data.rows).then(function (value) {
            console.log(value.data);
            if (value.data == 1) {
                alert("Data updated")
                location.reload(true)
            } else
                alert("cannot update this time")
        })
    }
//    get the guest list of the tran
    $scope.select_guest_list_data = function (value) {
        $http.post("php/select_guest_list.php", value.tran_id).then(function (value2) {
            console.log(value2.data)
            $scope.guest_list_selected_tran = value2.data;
        })
    }
    $scope.delete_guest = function (value) {
        if (confirm("Sure you want to delete : " + value.guest__name)) {
            $http.post("php/delete_guest.php", value.id).then(function (value2) {
                if (value2.data == 1) {
                    alert("deleted guest")
                    location.reload(true);
                } else
                    alert("try agein");
            })
        }

    }
//    update the guest_list table
    $scope.update_guest_list = function () {
        $http.post("php/update_guest_list.php", $scope.guest_list_selected_tran).then(function (value) {
            console.log(value)
            if (value.data == 1) {
                alert("data updated")
                location.reload(true);
            } else
                alert("try again");
        })
    }
    $scope.add_tran_det = function () {
        $scope.newtrandet.tran_id = $scope.selected_tran_data.tran_id;
        $scope.newtrandet.name_list = $scope.guest_list;
        console.log($scope.newtrandet);
        $http.post("php/add_tran_det.php", $scope.newtrandet).then(function (value) {
            console.log(value.data)
            if (value.data == 1) {
                alert("data added")
                location.reload(true);
            } else
                alert("try again");
        })
    }
    $scope.delete_tran_det = function (value) {
        if (confirm("want to delete")) {
            $http.post("php/delete_tran_data.php", value.tran_det_id).then(function (value2) {
                console.log(value2.data)
                if (value2.data == 1) {
                    alert("data deleted")
                    location.reload(true)
                } else
                    alert("try again")
            })
        }
    }

});
//view client controller
myapp.controller('view_client', function ($scope, $http, $filter) {
    console.log('view clients');
    if (localStorage.getItem('cust_Det'))
        $scope.print_det = JSON.parse(localStorage.getItem('cust_Det'))
    $http.get("php/client_list.php").then(function (value) {
        $scope.client_list = value.data;
        console.log($scope.client_list);
    });
    $scope.show_details = function (value) {
        console.log(value);
        $http.post("php/airlines_det.php", value.id).then(function (value2) {
            console.log(value2.data)
            $scope.air_det = value2.data;
        });
        $scope.selecteddata = value;
        console.log($scope.print_det)
        if ($scope.print_det == 1) {
            $scope.selecteddata.air_det = $scope.air_det;
            $scope.print_det = undefined;
            window.location = 'client_print.html';
        }
    }
    $scope.show_dom_details = function (value) {
        console.log(value);
        $('#view_det').modal('show');

        $scope.selecteddata = value;
    };
    //add new airlines det
    $scope.add_airlines = function (data) {
        console.log("ading airlines")
        $scope.newAirlines = data;
    };
    $scope.add_new_air_det = function () {
        if ($scope.newAirlines.pass == undefined || $scope.newAirlines.pass == null)
            $scope.newAirlines.pass = " ";
        console.log($scope.newAirlines);
        $http.post("php/add_new_airlines.php", $scope.newAirlines).then(function (value) {
            console.log(value.data);
            if (value.data.result == 1) {
                alert("New Airlines has been created");
                $scope.newAirlines = null;
                location.reload(true);
                // $('#add_airlines').modal('close');
            } else
                alert("You are not allowed just call the super man");
        })
    };
    //update airlines
    $scope.update_airlines = function (value) {
        console.log(value);
        $http.post("php/airlines_det.php", value.id).then(function (value2) {
            console.log(value2.data)
            $scope.air_det = value2.data;
        });
    };
    $scope.update_airdet = function (value) {
        $http.post("php/update_airlines.php", $scope.air_det).then(function (value2) {
            console.log(value2)
            if (value2.data == 1) {
                alert("data updated")
                location.reload(true)
            } else
                alert("try again")
        })
    }
    $scope.remove_airlines = function (data) {
        console.log(data);
        if (confirm("sure u want to delete")) {
            $http.post("php/drop_airlines.php", data.id).then(function (value) {
                console.log(value.data);
                if (value.data == 1) {
                    $http.post("php/airlines_det.php", data.id).then(function (value2) {
                        console.log(value2.data)
                        $scope.air_det = value2.data;
                    });
                    alert("airlines deleted");
                    location.reload(true);
                } else
                    alert("ask vikas banthia to check the server");
            })
        }
    };
    $scope.update_cust = function (x) {
        console.log(x);
        $scope.client = x;
        $scope.client.old_dob = x.dob;
        $scope.client.old_exp = x.expriy_date;
        $scope.client.old_iss = x.issue_date;
    }
    $scope.update_client_data = function () {
        if ($scope.client.dob == null)
            $scope.client.dob = new Date($scope.client.old_dob);
        if ($scope.client.expriy_date == null)
            $scope.client.expriy_date = new Date($scope.client.old_exp);
        if ($scope.client.issue_date == null)
            $scope.client.issue_date = new Date($scope.client.old_iss);
        $scope.client.dob = $filter('date')($scope.client.dob, 'yyyy-MM-dd');
        // $scope.client.airlines = $scope.airline_det;
        $scope.client.expriy_date = $filter('date')($scope.client.expriy_date, 'yyyy-MM-dd');
        $scope.client.issue_date = $filter('date')($scope.client.issue_date, 'yyyy-MM-dd');
        console.log($scope.client);

        $http.post("php/update_cust.php", $scope.client).then(function (value) {
            console.log(value.data);
            if (value.data.result == 1) {
                $scope.client_list = value.data.cust_list;
                console.log(value.data.cust_list);
                alert("data is updated please refresh");
                location.reload(true);
            } else
                alert("try not to panic and try till your last breadth")
        })
    }

    $scope.copyFunction = function (value) {
        console.log(value);
        var copyElement = document.createElement("textarea");
        copyElement.style.position = 'fixed';
        copyElement.style.opacity = '0';
        copyElement.textContent = value;
        var body = document.getElementsByTagName('body')[0];
        body.appendChild(copyElement);
        copyElement.select();
        document.execCommand('copy');
        body.removeChild(copyElement);
    };
//    method to show the modal
    $scope.show = function (data) {
        $scope.domestic_det = data;
        console.log(data)
        $('#update_det').modal('show');
    }
    $scope.update_domestic_det = function () {
        if ($scope.domestic_det.d_mname == undefined || $scope.domestic_det.d_mname == null)
            $scope.domestic_det.d_mname = " ";
        console.log($scope.domestic_det);
        $http.post("php/update_cust_domestic.php", $scope.domestic_det).then(function (value) {
            console.log(value.data);
            if (value.data.result == 1) {
                $scope.client_list = value.data.cust_list;
                alert("Details Update Successfully");
                location.reload(true);
            } else {
                alert("Please Contact Arihant as fast a possible or else Police will come")
            }
        })
    }


});
//view firm details
myapp.controller('view_firm', function ($scope, $http) {
    console.log('view firm');
    if (localStorage.getItem('firm_Det'))
        $scope.print_det = JSON.parse(localStorage.getItem('firm_Det'))
    $http.get("php/firm_list.php").then(function (value) {
        $scope.firm_list = value.data;
        console.log($scope.firm_list);
    });
    $scope.show_details = function (value) {
        console.log(value);
        console.log(value.id)
        $http.post("php/firm_owner_list.php", value.id).then(function (value2) {
            console.log(value2.data);
            $scope.owner_list = value2.data.owner;
            $scope.mob_no = value2.data.mob;
            $scope.mail = value2.data.mail;
        });
        $scope.selecteddata = value;
        $scope.firm = value;
    };
    $scope.print_firm = function () {
        console.log('print function')
        $scope.selecteddata.owner_list = $scope.owner_list;
        $scope.selecteddata.mob_no = $scope.mob_no;
        $scope.selecteddata.mail = $scope.mail;
        if ($scope.selecteddata.client_list_print == undefined)
            $scope.selecteddata.client_list_print = false;
        localStorage.setItem('firm_Det', JSON.stringify($scope.selecteddata))
        window.location = 'firm_print.html';
    };
    $scope.update_firm = function () {
        console.log($scope.firm);
        $http.post("php/update_firm.php", $scope.firm).then(function (value) {
            console.log(value.data)
            if (value.data == 1) {
                alert("data updated")
                location.reload(true);
            } else
                alert("try again");
        })
    }
    $scope.add_phn_no = function () {
        $scope.newphn_no.firm_id = $scope.selecteddata.id;
        console.log($scope.newphn_no);
        $http.post("php/add_new_firm_phn.php", $scope.newphn_no).then(function (value) {
            console.log(value.data)
            if (value.data == 1) {
                alert("new phone added")
                location.reload(true);
            } else
                alert("try again with valid results");
        })
    }
    $scope.add_mail = function () {
        $scope.newmail.firm_id = $scope.selecteddata.id;
        console.log($scope.newmail);
        $http.post("php/add_new_firm_mail.php", $scope.newmail).then(function (value) {
            console.log(value.data)
            if (value.data == 1) {
                alert("new email added")
                location.reload(true);
            } else
                alert("try again with valid results");
        })
    }
    $scope.add_pass = function () {
        $scope.newpass.firm_id = $scope.selecteddata.id;
        console.log($scope.newpass);
        $http.post("php/add_new_firm_pass.php", $scope.newpass).then(function (value) {
            console.log(value.data)
            if (value.data == 1) {
                alert("new email added")
                location.reload(true);
            } else
                alert("try again with valid results");
        })
    }
    $scope.remove_phn = function (x) {
        console.log(x)
        $http.post("php/drop_phn_firm.php", x.id).then(function (value) {
            console.log(value.data);
            if (value.data == 1) {
                alert("Phone Number deteled")
                location.reload(true);
            } else
                alert("try again");
        })
    }
    $scope.remove_mail = function (x) {
        $http.post("php/drop_email_firm.php", x.id).then(function (value) {
            console.log(value.data);
            if (value.data == 1) {
                alert("mail id deteled")
                location.reload(true);
            } else
                alert("try again");
        })
    }
    $scope.remove_pass = function (x) {
        $http.post("php/drop_pass.php", x.id).then(function (value) {
            console.log(value.data);
            if (value.data == 1) {
                alert("passenger deteled")
                location.reload(true);
            } else
                alert("try again");
        })
    }
    $scope.copyFunction = function (value) {
        console.log(value);
        var copyElement = document.createElement("textarea");
        copyElement.style.position = 'fixed';
        copyElement.style.opacity = '0';
        copyElement.textContent = value;
        var body = document.getElementsByTagName('body')[0];
        body.appendChild(copyElement);
        copyElement.select();
        document.execCommand('copy');
        body.removeChild(copyElement);
    }

});
//print voucher page
myapp.controller('print_data', function ($scope, $http, $timeout, $filter) {
    console.log('view print');
    $scope.data = JSON.parse(localStorage.getItem('tran_data'));

    console.log(localStorage.getItem('print_data'))
    // $scope.print_det = JSON.parse(localStorage.getItem('print_data'));
    if (localStorage.getItem('print_data') == 'undefined') {
        console.log(localStorage.getItem('print_data'))
        $scope.print_det = 0;
    } else {
        $scope.print_det = JSON.parse(localStorage.getItem('print_data'));

    }

    console.log($scope.print_det)
    $http.post("php/print_data_tran_det.php", $scope.data).then(function (value) {
        console.log(value.data);
        $scope.data.tran_det_data = value.data.tran_det;
        $scope.data.hotel_mob_data = value.data.hotel_mob;
        $scope.data.guest_list_data = value.data.guest_data;
        $scope.data.guest_found = value.data.guest_found;
        $scope.data.guest_list_data_len = $scope.data.guest_list_data.length;
        $scope.data.tran_det_len = $scope.data.tran_det_data.length;
    });
    $scope.data.save_data = $filter('date')($scope.data.chk_in_date, 'dd-MMM-yyyy');
    $scope.data.save_data_2 = $filter('date')($scope.data.chk_out_date, 'dd-MMM-yyyy');
    $scope.data.save_name = $filter('uppercase')($scope.data.city_name);
    $scope.data.save_fname = $filter('uppercase')($scope.data.fname);
    $scope.data.save_mname = $filter('uppercase')($scope.data.mname);
    $scope.data.save_lname = $filter('uppercase')($scope.data.lname);

    document.title = "HOTEL VOUCHER " + $scope.data.save_name + " " + $scope.data.save_fname + " " + $scope.data.save_mname + " " + $scope.data.save_lname + " " + $scope.data.save_data + " CI " + $scope.data.save_data_2 + " CO";
    console.log($scope.data)
    $timeout(function () {
        // $scope.data.guest_list_refined = [];
        // console.log($scope.data)
        var i = 0;
        var count = 0;
        // console.log(count);
        while ($scope.data.tran_det_len > 0) {
            var id = $scope.data.tran_det_data[i].tran_det_id;
            // console.log("tran_id : " + id);
            count = 0;
            var count_guest = $scope.data.guest_list_data_len;
            var adults = 0;
            var child = 0;
            while (count_guest > 0) {
                // console.log($scope.data.guest_list_data[count].tran_det_id )
                if ($scope.data.guest_list_data[count].tran_det_id == id) {
                    if ($scope.data.guest_list_data[count].guest_type == 'Adult')
                        adults += 1;
                    else if ($scope.data.guest_list_data[count].guest_type == 'Child')
                        child += 1;
                }
                // console.log($scope.data.guest_list_refined);
                // console.log("guest name : "+$scope.data.guest_list_data[count].guest__name);

                // console.log($scope.data.guest_list_data_len )
                count++;
                count_guest -= 1;
            }
            $scope.data.tran_det_data[i].adult = adults;
            $scope.data.tran_det_data[i].child = child;
            $scope.data.tran_det_len -= 1;
            i++;
        }
        console.log($scope.data)
    }, 500);
});
//email matter controller
myapp.controller('email_matter', function ($scope, $filter) {
    console.log("email matter")
    $scope.data = [];
    // $scope.test = "hey this is a \nline break";
    $scope.add_row = function () {
        console.log("roww addition")
        $scope.data.push({row_total: 1, row_content: [{label: '', value: 1}]});
        console.log($scope.data)
    }
    $scope.add_column = function (index) {
        console.log("col addition : " + index)
        $scope.data[index].row_content.push({label: '', value: 1});
        console.log($scope.data)
    }
    $scope.calculate = function () {
        var count = 0
        $scope.data.grandtotal = 0;
        while (count < $scope.data.length) {
            var rowcount = 0
            while (rowcount < $scope.data[count].row_content.length) {
                $scope.data[count].row_total = 1;
                rowcount++;
            }
            $scope.data.grandtotal = 0;
            // console.log($scope.data)
            count++;
        }
        var count = 0
        $scope.data.grandtotal = 0;
        while (count < $scope.data.length) {
            var rowcount = 0
            while (rowcount < $scope.data[count].row_content.length) {
                $scope.data[count].row_total = $scope.data[count].row_total * $scope.data[count].row_content[rowcount].value
                console.log($scope.data[count].row_total + " : " + $scope.data[count].row_content[rowcount].value)
                rowcount++;
            }
            $scope.data.grandtotal += $scope.data[count].row_total
            console.log($scope.data)
            count++;
        }
    }
})