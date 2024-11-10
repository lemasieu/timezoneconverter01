let timeZones = [];

// Fetch timezone data from the JSON file
fetch('timezone.json')
    .then(response => response.json())
    .then(data => {
        timeZones = data;
        populateTimeZoneOptions();
    })
    .catch(error => {
        console.error('Error loading timezone data:', error);
    });

// Populate dropdowns with time zone values
function populateTimeZoneOptions() {
    const input1 = document.getElementById("input1");
    const input5 = document.getElementById("input5");

    timeZones.forEach(zone => {
        const option1 = new Option(zone["Value of time_zone"], zone["Value of time_zone"]);
        const option5 = new Option(zone["Value of time_zone"], zone["Value of time_zone"]);
        input1.add(option1);
        input5.add(option5);
    });
}

// Update description based on selected time zone
function updateDescription(selectId, descriptionId) {
    const selectElement = document.getElementById(selectId);
    const descriptionElement = document.getElementById(descriptionId);
    const selectedZone = timeZones.find(zone => zone["Value of time_zone"] === selectElement.value);
    descriptionElement.value = selectedZone ? selectedZone.Description : '';
}

// Convert the time with DST adjustments
function convertTime() {
    const initialZone = document.getElementById("input1").value;
    const targetZone = document.getElementById("input5").value;
    const initialTime = document.getElementById("input3").value;
    const initialDate = document.getElementById("input4").value;

    const initialTimeZone = timeZones.find(zone => zone["Value of time_zone"] === initialZone);
    const targetTimeZone = timeZones.find(zone => zone["Value of time_zone"] === targetZone);

    // Combine the date and time into a single ISO string
    const initialDateTime = `${initialDate}T${initialTime}:00`;

    // Use Luxon to handle time zone conversion with DST adjustments
    const initialLuxonTime = luxon.DateTime.fromISO(initialDateTime, { zone: initialZone });
    const targetLuxonTime = initialLuxonTime.setZone(targetZone);

    // Format the target time with the desired output format
    const formattedTargetTime = targetLuxonTime.toFormat('hh:mm a dd/MM/yyyy');  // 12-hour format with AM/PM

    document.getElementById("input7").value = formattedTargetTime;
}

// Add copy-to-clipboard functionality to input7
document.getElementById("input7").addEventListener("click", function() {
    this.select();  // Select the text
    document.execCommand("copy");  // Copy the selected text to clipboard
    alert("Copied to clipboard: " + this.value);  // Show a confirmation
});

// Đảm bảo rằng jQuery và Select2 đã tải trước khi sử dụng
$(document).ready(function() {
    // Gắn các thành phố vào dropdown input1 và input5
    const timeZoneSelect = document.getElementById('input1');
    const targetSelect = document.getElementById('input5');

    timeZones.forEach(zone => {
        const option = document.createElement('option');
        option.value = zone["Value of time_zone"];
        option.textContent = zone["Description"];
        timeZoneSelect.appendChild(option);
    });

    timeZones.forEach(zone => {
        const option = document.createElement('option');
        option.value = zone["Value of time_zone"];
        option.textContent = zone["Description"];
        targetSelect.appendChild(option);
    });

    // Khởi tạo Select2 cho input1 và input5
    $('#input1').select2();
    $('#input5').select2();

    // Lắng nghe sự kiện thay đổi chọn lựa múi giờ
    $('#input1').change(function() {
        var selectedZone = $('#input1').val();
        var description = timeZones.find(zone => zone["Value of time_zone"] === selectedZone)["Description"];
        $('#input2').val(description); // Hiển thị mô tả tương ứng trong input2
    });

    $('#input5').change(function() {
        var selectedZone = $('#input5').val();
        var description = timeZones.find(zone => zone["Value of time_zone"] === selectedZone)["Description"];
        $('#input6').val(description); // Hiển thị mô tả tương ứng trong input6
    });
});
