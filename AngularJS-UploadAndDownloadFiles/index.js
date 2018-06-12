var app = angular.module('angularuploaddownloadfiles', []);
app.controller('UploadDownloadFileController', function ($scope, $window, $http) {
    var serviceBasePath = 'http://localhost:2653';
 
    $scope.DirectDownloadFile = function (fileId) {
        $http.get(serviceBasePath + '/api/Download/DirectDownloadFile?FileId=' + fileId, { responseType: 'arraybuffer' }).then(function (response) {

            var filename = response.headers()['x-filename'] || ("Document_" + new Date() + ".pdf");
            var contentType = response.headers()['content-type'];

            var linkElement = document.createElement('a');
            try {
                var blob = new Blob([response.data], { type: contentType });
                var url = window.URL.createObjectURL(blob);

                linkElement.setAttribute('href', url);
                linkElement.setAttribute("download", filename);

                var clickEvent = new MouseEvent("click", {
                    "view": window,
                    "bubbles": true,
                    "cancelable": false
                });
                linkElement.dispatchEvent(clickEvent);
            } catch (ex) {
                console.log(ex);
            }
        }, function (error) {

        })
       
    }
   
    $scope.files = [];
    $scope.encodedbase64_file = [];
    var fileSize = 0;
    var fileSizeAdd = 0;
    var FixedFileSize = 10485760;
    ////TO GET THE FILE INFORMATION.
    $scope.getFileDetails = function ($files) {
        
        var allowfiles = 0;
        fileSizeAdd = ($scope.files && $scope.files.length) ? fileSizeAdd : 0;
        fileSize = ($scope.files && $scope.files.length) ? fileSize : 0;
        $scope.$apply(function () {
            $scope.UploadFileLimit = false;
            $scope.FilesLimitErrorMessage = "";
        })

        $scope.SelectFilesErrorMessage = "";
        var allowedFileFormats = ["jpg", "jpeg", "png", "pdf", "doc", "docx", "tiff", "tif", "bmp"];
        if ($scope.files.length)
            $scope.files.forEach(function (item) {
                if (item.name.includes($files[0].name)) {
                    $scope.SelectFilesErrorMessage = "This Docs Is Already Added";
                }
            })
        if ($files && !$scope.SelectFilesErrorMessage) {

            for (var i = 0; i < $files.length; i++) {
                if (fileSizeAdd == fileSize) {
                    fileSize = parseFloat(fileSize) + parseFloat($files[i].size);
                }
                else {
                    if ($files[i].size < FixedFileSize) fileSize = fileSizeAdd;
                    else fileSize = parseFloat(fileSize) + parseFloat($files[i].size);
                }
                if (allowedFileFormats.indexOf($files[i].name.split(".").pop().toLowerCase()) > -1) {
                    $scope.FilesLimitErrorMessage = "";
                }
                else {
                    $scope.FilesLimitErrorMessage = "Only  jpg, jpeg, png, pdf, doc, docx, tiff, tif, bmp files are allowed!";
                    break;
                }
            }
            if (!$scope.FilesLimitErrorMessage) {
                if (fileSize <= FixedFileSize) {  
                    $scope.UploadFileLimit = false;
                    $scope.FilesLimitErrorMessage = "";
                    $scope.filesList = [];
                    $scope.$apply(function () {

                        //// STORE THE FILE OBJECT IN AN ARRAY.
                        for (var i = 0; i < $files.length; i++) {
                            $scope.filesList.push($files[i])

                            setupReader($files[i]);

                        }
                        function setupReader(file) {
                            var name = file.name;
                            var reader = new FileReader();
                            reader.onload = function (e) {
                                // get file content  
                                $scope.encodedbase64_file.push(e.target.result);
                            }
                            reader.readAsDataURL(file);
                        }
                        $scope.disbleUploadFile = true;
                    });
                    if ($scope.filesList)
                        $scope.btnAddDisable = false;
                }
                else {
                    //  angular.element("input[type='file']").val(null);
                }
            }
            else {
                $scope.FilesLimitErrorMessage = "Only  jpg, jpeg, png, pdf, doc, docx, tiff, tif, bmp files are allowed!";
            }
        }
    };

    //// To add the selected files to the grid table
    $scope.uploadFiles = function () {
        if ($scope.FileDescription) {
            $scope.SelectFilesErrorMessage = "";

            if ($scope.filesList && $scope.filesList.length && !$scope.SelectFilesErrorMessage) {
                $scope.ValidationMessage = "";
                var files = $scope.filesList;
                fileSizeAdd = fileSize;
                //  $scope.files = files;
                if (files && files.length > 0) {
                    var data = new FormData();
                    for (i = 0; i < files.length; i++) {
                        data.append("file" + i, files[i]);
                        files[i].FileDescription = $scope.FileDescription;
                        $scope.files.push(files[i]);
                        $scope.filesList = [];
                    }
                }
                if ($scope.files && $scope.files.length > 0) {
                    $scope.btnAddDisable = true;
                    $scope.disbleUploadFile = true;
                }
                else {
                    $scope.btnAddDisable = false;
                    $scope.disbleUploadFile = false;
                    $scope.UploadFileLimit = true;
                    if (fileSize > FixedFileSize)  
                        $scope.FilesLimitErrorMessage = $scope.FilesLimitErrorMessage ? $scope.FilesLimitErrorMessage : "Files Limit Exceeded 10 MB";  //// 10MB=10485760  Bytes (binary)
                    // angular.element("input[type='file']").val(null);
                }
            }
            else {
                if (fileSize > FixedFileSize) { 
                    $scope.UploadFileLimit = true;
                    $scope.FilesLimitErrorMessage = $scope.FilesLimitErrorMessage ? $scope.FilesLimitErrorMessage : "Files Limit Exceeded 10 MB";

                }
                else {
                    if ($scope.FilesLimitErrorMessage) {
                        $scope.UploadFileLimit = true;
                    }
                    else {
                        $scope.UploadFileLimit = false;
                        $scope.SelectFilesErrorMessage = "Please Choose File To Upload";
                    }
                }
            }
        }
        else $scope.SelectFilesErrorMessage = $scope.SelectFilesErrorMessage ? $scope.SelectFilesErrorMessage : "Please Enter File Name";
    };
    /// To Delete the files in the grid table by Id
    $scope.DeleteFile = function (id) {
        var index = -1;
        var comArr = eval($scope.files);
        for (var i = 0; i < comArr.length; i++) {
            if (i === id) {
                index = i;
                break;
            }

        }
        if (index === -1) {
            alert("Something gone wrong");
        }
        fileSize = parseFloat(fileSize) - parseFloat($scope.files[index].size);
        if (fileSize <= FixedFileSize) {
            $scope.UploadFileLimit = false;
            $scope.FilesLimitErrorMessage = "";
        }
        //  var index = $scope.files.indexOf(name);
        $scope.files.splice(index, 1);
        if ($scope.files.length <= 0) {
            $scope.btnAddDisable = false;
            $scope.disbleUploadFile = false;
            // angular.element("input[type='file']").val(null);
        }
        angular.element("input[type='file']").val();
    }

    //// To Submit files to webapi
    $scope.SubmitFiles = function () {
        $scope.UploadFilesList = [];
        $scope.UploadFileData = [];
        $scope.FileTypeData = [];
        $scope.ShowErrorFiles = false;
        $scope.SubmitFilesErrorMessage = "";
        for (var i = 0; i < $scope.files.length; i++) {
            $scope.UploadFileData.push($scope.encodedbase64_file[i].substring($scope.encodedbase64_file[i].indexOf("base64,") + 7));
            $scope.FileTypeData.push($scope.encodedbase64_file[i].substring(5, $scope.encodedbase64_file[i].indexOf(";")));
            var FileDetails = {
                File: $scope.UploadFileData[i],
                FileName: $scope.files[i].name.substr(0, $scope.files[i].name.lastIndexOf('.')),
                FileDescription: $scope.FileDescription,
                FileType: $scope.FileTypeData[i]
            }
        
            $scope.UploadFilesList.push(FileDetails);
        }
       
        if ($scope.UploadFilesList.length && !$scope.SelectFilesErrorMessage) {
            $scope.ShowLoader = true;
            $http.put(serviceBasePath + '/api/Upload/UploadFile', $scope.UploadFilesList).then(function (response) {
                $scope.ShowLoader = false;
                $scope.ShowSuccessMessage = true;
                $scope.SubmitFilesSucessMessage = response.data;
                $window.location.reload();

            }, function (error) {
                var errorMessages = [];
                if (error.data && error.data.ModelState) {
                    for (var key in error.data.ModelState) {
                        for (var i = 0; i < error.data.ModelState[key].length; i++) {
                            errorMessages.push(error.data.ModelState[key][i]);
                        }
                    }
                    // alert(errorMessages[0]);
                    $scope.ShowLoader = false;
                    $scope.ShowErrorFiles = true;
                    $scope.SubmitFilesErrorMessage = errorMessages[0];
                }
                else {
                    $scope.ShowLoader = false;
                    error ? ((error.data && error.data.Message) ? $scope.OrderListErrorMessage = error.data.Message : $scope.OrderListErrorMessage = "The Request Is Invalid") : $scope.OrderListErrorMessage = "Invalid Request";
                }
            })
        }
        else {
            $scope.SelectFilesErrorMessage = $scope.SelectFilesErrorMessage ? $scope.SelectFilesErrorMessage : "Please Select A File";
        }
    }

    //// To Clear The popup controls when Open the popup
    $scope.ClearData = function (item) {
        angular.element("input[type='file']").val(null);
        $scope.CaseId = item.SugarCRMCaseId;
        $scope.files = [];
        $scope.FileDescription = "";
        $scope.disbleUploadFile = true;
        $scope.FilesLimitErrorMessage = "";
        $scope.btnAddDisable = false;
        $scope.selectedCard = 0;
        $scope.ShowSuccessMessage = false;
        $scope.SubmitFilesSucessMessage = "";
        $scope.SelectFilesErrorMessage = "";
    }
    var InIt = function () {
        $http.get(serviceBasePath + '/api/Upload/GetAllData').then(function (response) {
            $scope.GetFileData = response.data;

        }, function (error) {

        })
    }
    InIt();
});


