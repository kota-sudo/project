const bookingBoard = document.getElementById("bookingBoard");
const bookingMonthLabel = document.getElementById("bookingMonthLabel");
const bookingSelectedText = document.getElementById("bookingSelectedText");
const visitSlotInput = document.getElementById("visitSlotInput");
const prevWeekBtn = document.getElementById("prevWeekBtn");
const nextWeekBtn = document.getElementById("nextWeekBtn");
const bookingTodayBtn = document.getElementById("bookingTodayBtn");
const entryForm = document.getElementById("entryForm");

const entryName = document.getElementById("entryName");
const entryEmail = document.getElementById("entryEmail");
const entryTel = document.getElementById("entryTel");

const weekNames = ["日", "月", "火", "水", "木", "金", "土"];
const timeSlots = generateTimeSlots("11:00", "20:00", 60);

const today = new Date();
let currentWeekStart = getStartOfWeek(today);
let selectedSlot = null;
let availabilityMap = {};

function generateTimeSlots(start, end, stepMinutes) {
    const result = [];
    const [startHour, startMinute] = start.split(":").map(Number);
    const [endHour, endMinute] = end.split(":").map(Number);

    let current = startHour * 60 + startMinute;
    const endValue = endHour * 60 + endMinute;

    while (current <= endValue) {
        const hour = String(Math.floor(current / 60)).padStart(2, "0");
        const minute = String(current % 60).padStart(2, "0");
        result.push(`${hour}:${minute}`);
        current += stepMinutes;
    }

    return result;
}

function getStartOfWeek(date) {
    const copied = new Date(date);
    const day = copied.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    copied.setDate(copied.getDate() + diff);
    copied.setHours(0, 0, 0, 0);
    return copied;
}

function formatMonthLabel(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return `${year}年${month}月`;
}

function formatDateNumber(date) {
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${month}/${day}`;
}

function formatFullSlot(date, time) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const week = weekNames[date.getDay()];
    return `${year}-${month}-${day} ${time} (${week})`;
}

function getWeekDates(startDate) {
    const dates = [];

    for (let i = 0; i < 7; i++) {
        const d = new Date(startDate);
        d.setDate(startDate.getDate() + i);
        dates.push(d);
    }

    return dates;
}

function createCell(content, className = "") {
    const div = document.createElement("div");
    div.className = className;
    div.innerHTML = content;
    return div;
}

function createWeekKey(weekDates) {
    const first = weekDates[0];
    const y = first.getFullYear();
    const m = String(first.getMonth() + 1).padStart(2, "0");
    const d = String(first.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}

function generateRandomAvailability() {
    const map = {};

    timeSlots.forEach((time) => {
        map[time] = [];

        for (let i = 0; i < 7; i++) {
            const isWeekend = i === 5 || i === 6;
            const rate = isWeekend ? 0.25 : 0.45;
            const isAvailable = Math.random() < rate;
            map[time].push(isAvailable);
        }
    });

    return map;
}

function getAvailabilityForCurrentWeek() {
    const weekDates = getWeekDates(currentWeekStart);
    const weekKey = createWeekKey(weekDates);

    if (!availabilityMap[weekKey]) {
        availabilityMap[weekKey] = generateRandomAvailability();
    }

    return availabilityMap[weekKey];
}

function renderBookingCalendar() {
    const weekDates = getWeekDates(currentWeekStart);
    const currentAvailability = getAvailabilityForCurrentWeek();

    bookingMonthLabel.textContent = formatMonthLabel(weekDates[0]);
    bookingBoard.innerHTML = "";

    if (!selectedSlot) {
        bookingSelectedText.textContent = "希望日時を選択してください";
        bookingSelectedText.classList.remove("is-active");
    }

    const grid = document.createElement("div");
    grid.className = "booking-grid";

    grid.appendChild(createCell("", "booking-corner"));

    weekDates.forEach((date) => {
        const day = date.getDay();
        const weekdayClass = day === 6 ? "sat" : day === 0 ? "sun" : "";

        const head = createCell(
            `<span class="booking-date">${formatDateNumber(date)}</span>
             <span class="booking-weekday ${weekdayClass}">(${weekNames[day]})</span>`,
            "booking-day-head"
        );

        grid.appendChild(head);
    });

    timeSlots.forEach((time) => {
        const timeLabel = createCell(time, "booking-time");
        grid.appendChild(timeLabel);

        currentAvailability[time].forEach((isAvailable, dayIndex) => {
            const cell = document.createElement("button");
            cell.type = "button";
            cell.className = "booking-cell";

            const targetDate = weekDates[dayIndex];
            const slotValue = formatFullSlot(targetDate, time);

            if (isAvailable) {
                cell.classList.add("is-available");
                cell.textContent = "○";
                cell.dataset.slot = slotValue;

                if (selectedSlot === slotValue) {
                    cell.classList.add("is-selected");
                }

                cell.addEventListener("click", function () {
                    selectedSlot = slotValue;
                    visitSlotInput.value = slotValue;
                    bookingSelectedText.textContent = `選択中：${slotValue}`;
                    bookingSelectedText.classList.add("is-active");
                    renderBookingCalendar();
                });
            } else {
                cell.classList.add("is-disabled");
                cell.textContent = "×";
                cell.disabled = true;
            }

            grid.appendChild(cell);
        });
    });

    bookingBoard.appendChild(grid);
}

prevWeekBtn.addEventListener("click", function () {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() - 7);
    currentWeekStart = newDate;
    renderBookingCalendar();
});

nextWeekBtn.addEventListener("click", function () {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() + 7);
    currentWeekStart = newDate;
    renderBookingCalendar();
});

bookingTodayBtn.addEventListener("click", function () {
    currentWeekStart = getStartOfWeek(today);
    renderBookingCalendar();
});

if (entryForm) {
    entryForm.addEventListener("submit", function (e) {
        e.preventDefault();

        if (!entryName.value.trim()) {
            alert("お名前を入力してください。");
            entryName.focus();
            return;
        }

        if (!entryEmail.value.trim()) {
            alert("メールアドレスを入力してください。");
            entryEmail.focus();
            return;
        }

        if (!visitSlotInput.value) {
            alert("見学希望日時を選択してください。");
            return;
        }

        window.location.href = "thanks.html";
    });
}

renderBookingCalendar();