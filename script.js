const reportForm = document.getElementById("reportForm");
const reportsContainer = document.getElementById("reportsContainer");
const searchInput = document.getElementById("searchInput");
const message = document.getElementById("message");

let reports = JSON.parse(localStorage.getItem("reports")) || [];

function saveReports() {
    localStorage.setItem("reports", JSON.stringify(reports));
}

function displayReports(reportList = reports) {
    reportsContainer.innerHTML = "";

    if (reportList.length === 0) {
        reportsContainer.innerHTML = "<p>No reports found.</p>";
        return;
    }

    reportList.forEach((report) => {
        const card = document.createElement("div");

        card.className = "report-card";

        card.innerHTML = `
            <h3>${escapeHtml(report.itemName)}</h3>
            <p><strong>Type:</strong> ${escapeHtml(report.reportType)}</p>
            <p><strong>Location:</strong> ${escapeHtml(report.location)}</p>
            <p><strong>Description:</strong> ${escapeHtml(report.description)}</p>

            <button
                class="delete-btn"
                onclick="deleteReport(${report.id})"
            >
                Delete
            </button>
        `;

        reportsContainer.appendChild(card);
    });
}

function escapeHtml(value) {
    value = String(value);

    return value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

reportForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const itemName = document.getElementById("itemName").value.trim();
    const reportType = document.getElementById("reportType").value;
    const location = document.getElementById("location").value.trim();
    const description = document.getElementById("description").value.trim();

    if (!itemName || !reportType || !location || !description) {
        showMessage("Please complete all fields.");
        return;
    }

    const newReport = {
        id: Date.now(),
        itemName,
        reportType,
        location,
        description
    };

    reports.push(newReport);

    saveReports();

    reportForm.reset();

    showMessage("Report added successfully.");

    displayReports();
});

function deleteReport(id) {
    reports = reports.filter((report) => report.id !== id);

    saveReports();

    displayReports();

    showMessage("Report deleted.");
}

searchInput.addEventListener("input", function () {
    const keyword = searchInput.value.toLowerCase().trim();

    const filteredReports = reports.filter((report) =>
        matchesKeyword(report, keyword)
    );

    displayReports(filteredReports);
});

function matchesKeyword(report, keyword) {
    return (
        report.itemName.toLowerCase().includes(keyword) ||
        report.location.toLowerCase().includes(keyword) ||
        report.description.toLowerCase().includes(keyword) ||
        report.reportType.toLowerCase().includes(keyword)
    );
}

function showMessage(text) {
    message.className = "message";
    message.textContent = text;
}

displayReports();