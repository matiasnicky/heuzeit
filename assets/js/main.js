// assets/js/main.js - robust version for multiple pages
document.addEventListener('DOMContentLoaded', function () {
  console.log('main.js loaded');

  // ---------- Error popup ----------
  const errorIcon = document.getElementById('errorIcon');
  const errorPopup = document.getElementById('errorPopup');
  const closePopup = document.getElementById('closePopup');

  if (errorIcon && errorPopup) {
    errorIcon.addEventListener('click', () => {
      errorPopup.style.display = 'flex';
    });
  }
  if (closePopup && errorPopup) {
    closePopup.addEventListener('click', () => {
      errorPopup.style.display = 'none';
    });
  }
  // clicking outside popup closes it (guarded)
  if (errorPopup) {
    window.addEventListener('click', (e) => {
      if (e.target === errorPopup) errorPopup.style.display = 'none';
    });
  }

  // ---------- Presets / Time table (only if present) ----------
  const presets = {
    Summer: [
      ["08:00", "08:30"],
      ["12:00", "12:30"],
      ["18:00", "18:30"]
    ],
    Winter: [
      ["09:00", "09:30"],
      ["13:00", "13:30"],
      ["19:00", "19:30"]
    ]
  };

  function updateTimes(presetName) {
    const container = document.getElementById("timeValuesContainer");
    if (!container) return; // not on this page
    container.innerHTML = ""; // clear previous times

    let totalMinutes = 0;
    const rows = presets[presetName] || [];
    rows.forEach(times => {
      const div = document.createElement("div");
      div.className = "time-values";
      div.innerHTML = `<div>${times[0]}</div><div>${times[1]}</div>`;
      container.appendChild(div);

      const start = times[0].split(":").map(Number);
      const end = times[1].split(":").map(Number);
      totalMinutes += (end[0] * 60 + end[1]) - (start[0] * 60 + start[1]);
    });

    const totalEl = document.getElementById("totalHours");
    if (totalEl) totalEl.textContent = `Total hours: ${(totalMinutes / 60).toFixed(1)} h`;
  }

  // call only if the container exists
  if (document.getElementById("timeValuesContainer")) {
    updateTimes("Summer");
  }

  // ---------- Rack toggle (only if present) ----------
  const toggleBtn = document.getElementById('toggleRackBtn');
  const rackImg = document.getElementById('rackImage');

  if (toggleBtn && rackImg) {
    toggleBtn.addEventListener('click', () => {
      toggleBtn.classList.toggle('active'); // switch CSS class
      if (toggleBtn.classList.contains('active')) {
        toggleBtn.textContent = 'Close';
        rackImg.src = 'assets/img/opened.png';
      } else {
        toggleBtn.textContent = 'Open';
        rackImg.src = 'assets/img/closed.png';
      }
    });
  }

  // ---------- Clock logic ----------
  let isAutomatic = true;
  let manualBaseTime = null; // will hold Date object if manual is active

  const timeToggle = document.getElementById('timeToggle');
  const manualContainer = document.getElementById('manualTimeContainer');
  const updateManualBtn = document.getElementById('updateManualTimeBtn');
  const manualHours = document.getElementById('manualHours');
  const manualMinutes = document.getElementById('manualMinutes');
  const timeValue = document.getElementById('timeValue');

  function updateTime() {
    if (!timeValue) return;

    let now;

    if (isAutomatic) {
      now = new Date();
    } else if (manualBaseTime) {
      // Calculate how long since we set manual time
      const elapsed = Date.now() - manualBaseTime.start; // ms since set
      now = new Date(manualBaseTime.base.getTime() + elapsed);
    } else {
      return; // nothing to show
    }

    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    timeValue.textContent = `${hours}:${minutes}`;
  }

  // Toggle between automatic/manual
  if (timeToggle) {
    timeToggle.addEventListener('change', () => {
      isAutomatic = timeToggle.checked;
      if (isAutomatic) {
        manualContainer.style.display = 'none';
        manualBaseTime = null; // reset
        updateTime(); // refresh
      } else {
        manualContainer.style.display = 'flex';
      }
    });
  }

  // Update manual time
  if (updateManualBtn) {
    updateManualBtn.addEventListener('click', () => {
      const h = parseInt(manualHours.value, 10) || 0;
      const m = parseInt(manualMinutes.value, 10) || 0;
      const base = new Date();
      base.setHours(h, m, 0, 0);

      manualBaseTime = {
        base,
        start: Date.now()
      };

      updateTime();
    });
  }

    // run clock immediately and keep updating
    updateTime();
    setInterval(updateTime, 1000);

    document.getElementById('updateSsidBtn').addEventListener('click', () => {
        const newSsid = document.getElementById('ssidInput').value.trim();
        if (newSsid) {
            alert(`SSID updated to: ${newSsid}`);
            // Here you can also call your backend or device API to actually change the SSID
        }
    });
    
    // Placeholder function for populating networks (from Python/Raspberry Pi backend)
    function scanAvailableNetworks() {
    const networks = ['Home WiFi', 'OfficeNet', 'GuestNetwork']; // will come from backend
    const select = document.getElementById('externalSsidSelect');
    networks.forEach(ssid => {
        const option = document.createElement('option');
        option.value = ssid;
        option.textContent = ssid;
        select.appendChild(option);
    });
}

    // Connect button click handler
    document.getElementById('connectWifiBtn').addEventListener('click', () => {
        const selectedSsid = document.getElementById('externalSsidSelect').value;
        const password = document.getElementById('wifiPassword').value;
        
        // send selectedSsid and password to backend (Python on Raspberry Pi)
        console.log("Connecting to:", selectedSsid, "with password:", password);
        // Update UI status
        document.getElementById('wifiStatus').textContent = `Status: Connecting to ${selectedSsid}...`;
    });
});
