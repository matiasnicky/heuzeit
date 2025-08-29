document.addEventListener('DOMContentLoaded', function() {
    // Existing button toggle
    const btn = document.getElementById('openCloseBtn');
    if (btn) {
        btn.addEventListener('click', function() {
            this.classList.toggle('active');
            this.textContent = this.classList.contains('active') ? 'Close' : 'Open';
        });
    }

    // Clock + Timezone
    function updateClock() {
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        document.getElementById('clock').textContent = timeString;
        document.getElementById('timezone').textContent = timezone;
    }
    setInterval(updateClock, 1000);
    updateClock();

    // Simple Dynamic Graph for Power Flow
    const canvas = document.getElementById("currentGraph");
    if (canvas) {
        const ctx = canvas.getContext("2d");
        const width = canvas.width;
        const height = canvas.height;

        // Fix for high-DPI screens
        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);

        let data = [];
        const maxPoints = 50; // number of time steps shown
        const maxPower = 30;  // Y-axis max value

        function drawGraph() {
            ctx.clearRect(0, 0, width, height);

            // Draw axes
            ctx.beginPath();
            ctx.moveTo(30, 10);
            ctx.lineTo(30, height - 20);        // Y-axis
            ctx.lineTo(width - 10, height - 20); // X-axis
            ctx.strokeStyle = "#333";
            ctx.lineWidth = 1;
            ctx.stroke();

            // Y-axis numeric labels
            ctx.font = "10px Arial";
            ctx.fillStyle = "#333";
            ctx.fillText(maxPower, 2, 15);
            ctx.fillText("0", 15, height - 20);

            // Draw power line
            if (data.length > 1) {
                ctx.beginPath();
                for (let i = 0; i < data.length; i++) {
                    const x = 30 + (i * (width - 40) / maxPoints);
                    const y = (height - 20) - (data[i] / maxPower) * (height - 40);
                    if (i === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.strokeStyle = "#2dc391";
                ctx.lineWidth = 2;
                ctx.stroke();
            }
        }

        function updateGraph() {
            // Simulate power between 0 and 30
            const newPower = Math.floor(Math.random() * maxPower);
            data.push(newPower);
            if (data.length > maxPoints) data.shift();
            drawGraph();
        }

        setInterval(updateGraph, 1000); // update every second
    }

});