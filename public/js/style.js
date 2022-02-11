async function fetchdataJSON() {
    const response = await fetch('http://localhost:4200/getdata')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            var d1 = $("<div>").addClass("d-flex align-items-start").appendTo("#addhere");
            var d2 = $("<div>").addClass("nav flex-column nav-pills me-3").attr({ "role": "tablist", "aria-orientation": "vertical" }).appendTo(d1);
            var d3 = $("<div>").addClass("tab-content").appendTo(d1);

            for (var i = 0; i < data.length; i++) {
                var act1 = "";
                var act2 = "";
                if (i == 0) {
                    act1 = "active";
                    act2 = "show active";
                }
                var b1 = $("<button>").addClass("nav-link " + act1).attr({ "id": "url-tab-" + i, "data-bs-toggle": "pill", "data-bs-target": "#url-" + i, "type": "button", "role": "tab", "aria-controls": "url-" + i, "aria-selected": "true" }).html(data[i].name).appendTo(d2);

                var i1 = $("<div>").addClass("tab-pane fade " + act2).attr({ "id": "url-" + i, "role": "tabpanel", "aria-labelledby": "url-tab-" + i }).appendTo(d3);
                var devicesdata=data[i].devices;
                var dd0=$("<div>").addClass("row").appendTo(i1);
                for(var j=0;j<devicesdata.length;j++){                    
                    var dd1=$("<div>").addClass("col-md-6").appendTo(dd0);
                    $("<h4>").html(devicesdata[j].deviceName).appendTo(dd1);
                    $("<iframe>").attr({ "src": devicesdata[j].deviceUrl, "width": "700", "height": "550" }).appendTo(dd1);
                }
                
            }

        })
    return response;
}

let data = fetchdataJSON();

var bedName = document.getElementById("bedName");
var deviceUrl = document.getElementById("urldata");
var deviceName = document.getElementById("devicename");

var deviceId = 0;
var deviceData ={}
var tbl = document.getElementById("tableval")
localStorage.setItem("devices","[]");

$("#addDevice").on("click", function () {
    var devices=JSON.parse(localStorage.getItem("devices"));
     deviceData={
         "deviceUrl": deviceUrl.value,
         "deviceName": deviceName.value
     };

     deviceUrl.value="";
     deviceName.value="";
     devices.push(deviceData);
     localStorage.setItem("devices", JSON.stringify(devices));
     console.log(deviceData)
     var tb="";
     for(var i=0;i<devices.length;i++){
       tb+= "<tr><td>" + devices[i].deviceUrl + "</td><td>" + devices[i].deviceName + "</td><td></td></tr>";
     }
     $(tbl).html(tb);
    
 });



$("#submitdata").on("click", function () {
    var dataAjax = {}
    dataAjax.bedName = bedName.value;   
    
    var devices=JSON.parse(localStorage.getItem("devices"));
    dataAjax.devices= devices;

    console.log(dataAjax);

    if (bedName.value === "") {
        alert("please enter Bed name");
        return false;
    }
    else if (devices === "") {
        alert("please enter device data");
        return false;
    }
    else {
        $.ajax({
            type: 'POST',
            url: "http://localhost:4200/putdata",
            data: dataAjax,
            dataType: "text",
            success: function (resultData) {
                bedName.value ="";
                devices.value ="";
                $('#modal').modal('hide');
                deviceData=[];
                alert(resultData);
                localStorage.setItem("devices","[]");
                $(tbl).html('');
                fetchdataJSON();
            }
        });

    }
})

$(function () {


    $(document.body).delegate(".delRowBtn", "click", function () {
        $(this).closest("tr").remove();
    });

});