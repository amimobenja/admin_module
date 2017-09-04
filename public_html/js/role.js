/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


angular.module('roleFormApp', ['angularUtils.directives.dirPagination'])
        .controller('roleController', function ($scope, $http, $timeout) {  
            
            
            
            $scope.MyRecCollection = [];
            $http.get('http://localhost:8080/SMTP/SMS/hget_entities').success(function (data) {                
                $scope.sel = {permissions: {}};
                for (var i = 0, j = data.entities.length; i < j; i++) {
                    for (var k = 0, l = data.entities[i].entityPermissions.length; k < l; k++) {
                        $scope.MyRecCollection.push(data.entities[i].entityPermissions[k]);
//                        $scope.selection.permissions[[$scope.allEntities[i].entityPermissions[k].permissionId]] = true;
                    }
                }
                
            });
            
            $scope.sort = function(keyname){
                $scope.sortKey = keyname;   //set the sortKey to the param passed
                $scope.reverse = !$scope.reverse; //if true make it false and vice versa
            }

            $scope.myEntityPermissionsFunc = function () {
                $scope.myEntityTxt = "";
                $http.get('http://localhost:8080/SMTP/SMS/hget_entities').
                        then(function (response) {
                            if (response.data) {
                                $scope.showMyEntityPermissions = true;
                                $scope.allEntities = response.data.entities;
                                $scope.selection = {permissions: {}};

//                                alert($scope.allEntities.length);
                                for (var i = 0, j = $scope.allEntities.length; i < j; i++) {
//                                    alert($scope.allEntities[i].entityName);
                                    for (var k = 0, l = $scope.allEntities[i].entityPermissions.length; k < l; k++) {
//                                        alert($scope.allEntities[i].entityPermissions[k].permission);
                                        $scope.selection.permissions[[$scope.allEntities[i].entityPermissions[k].permissionId]] = true;
                                    }
                                }
                                
                                
                            } else {
                                $scope.showMyEntityPermissions = false;
                                $scope.myEntityTxt = "No Entities are Present at the moment";
                            }
                        });
            };
                        

            $scope.myEditRoleFormFunc = function () {
                $scope.myRoleIdTxt = "";
                $http.get('http://localhost:8080/SMTP/SMS/get_role_permission/' + $scope.rID).
                        then(function (response) {
                            if (response.data) {
                                $scope.showMyEditEntityPermissions = true;
                                $scope.eRole = response.data;

                                $http.get('http://localhost:8080/SMTP/SMS/hget_entities').
                                        then(function (response) {
                                            if (response.data) {
                                                $scope.allEditEntities = response.data.entities;

                                                $scope.editSelection = {permissions: {}};

                                                $scope.showme = false;
//                                                alert($scope.allEditEntities.length);
                                                for (var m = 0, n = $scope.eRole.permissions.length; m < n; m++) {
//                                                    alert($scope.eRole.permissions[m].permission);
                                                    $scope.editSelection.permissions[[$scope.eRole.permissions[m].permissionId]] = true;
                                                }

//                                                for (var i = 0, j = $scope.allEditEntities.length; i < j; i++) {
//                                                    //                                    alert($scope.allEntities[i].entityName);
//                                                    for (var k = 0, l = $scope.allEditEntities[i].entityPermissions.length; k < l; k++) {
//                                                        //alert($scope.allEntities[i].entityPermissions[k].permission);
////                                                        $scope.editSelection.permissions[[$scope.allEditEntities[i].entityPermissions[k].permissionId]] = true;
//                                                    }
//                                                }
                                            } else {
                                                alert("No Entities are Present at the moment");
                                            }
                                        });


                            } else {
                                $scope.showMyEditEntityPermissions = false;
                                $scope.myRoleIdTxt = "Role ID - " + $scope.rID + " Does not exist";
                            }
                        });

            };

            $scope.createRole = function (grantedPermissions) {
                var permissions = [];
                angular.forEach(grantedPermissions, function (value, key) {
                    if (value) {
                        permissions.push({"permissionId": key});
                    }
                });

                var rolePermissions = {'roleName': $scope.role.roleName, 'description': $scope.role.Description,
                    'rolePermissionMapCollection': permissions};

                $scope.roleMaster = angular.copy(rolePermissions);

//                Call the Post Service
                $http.post('http://localhost:8080/SMTP/SMS/hcreate_role', JSON.stringify(rolePermissions)).then(function (response) {
                    if (response.data)
                        $scope.msg = "Post Data Submitted Successfully!";

                        $scope.statusval = response.data.statusCode;
                        $scope.statustext = response.data.statusName;
                        
                        $scope.loginAlertMessage = true;
                        $timeout(function() {
                           $scope.loginAlertMessage = false;
                        }, 3000);
                        
                        $scope.role.roleName = "";
                        $scope.role.Description = "";
                        

                }, function (response) {
                    
                    $scope.loginAlertMessage = true;
                    
                    $scope.msg = "Service not Exists";
                    $scope.statusval = response.data.statusCode;
                    $scope.statustext = response.data.statusName;
                    $scope.headers = response.headers();
                });

            };


            $scope.updateRole = function (upgradeGrantedPermissions, entityId) {
                var permissions = [];
                angular.forEach(upgradeGrantedPermissions, function (value, key) {
                    if (value) {
                        permissions.push({"permissionId": key});
                    }
                });

                var rolePermissions = {'roleId': entityId, 'roleName': $scope.eRole.roleName,
                    'description': $scope.eRole.description,
                    'rolePermissionMapCollection': permissions};

                $scope.updateRoleMaster = angular.copy(rolePermissions);

//                Call the Post Service
                $http.put('http://localhost:8080/SMTP/SMS/updateh_role',
                        JSON.stringify(rolePermissions)).then(function (response) {
                    if (response.data)
                        $scope.msg = "Post Data Submitted Successfully!";

                    $scope.statusval = response.data.statusCode;
                    $scope.statustext = response.data.statusName;

                }, function (response) {
                    $scope.msg = "Service not Exists";
                    $scope.statusval = response.data.statusCode;
                    $scope.statustext = response.data.statusName;
                    $scope.headers = response.headers();
                });

            };
            
            $scope.clearRoleForm = function () {
                $scope.role.roleName = "";
                $scope.role.Description = "";
            };

        });

        