const recruitEntryForm = document.getElementById("recruitEntryForm");

const applicantName = document.getElementById("applicantName");
const applicantKana = document.getElementById("applicantKana");
const applicantEmail = document.getElementById("applicantEmail");
const applicantTel = document.getElementById("applicantTel");
const jobType = document.getElementById("jobType");
const employmentType = document.getElementById("employmentType");
const motivation = document.getElementById("motivation");

if (recruitEntryForm) {
    recruitEntryForm.addEventListener("submit", function (e) {
        e.preventDefault();

        if (!applicantName.value.trim()) {
            alert("お名前を入力してください。");
            applicantName.focus();
            return;
        }

        if (!applicantKana.value.trim()) {
            alert("フリガナを入力してください。");
            applicantKana.focus();
            return;
        }

        if (!applicantEmail.value.trim()) {
            alert("メールアドレスを入力してください。");
            applicantEmail.focus();
            return;
        }

        if (!applicantTel.value.trim()) {
            alert("電話番号を入力してください。");
            applicantTel.focus();
            return;
        }

        if (!jobType.value) {
            alert("希望職種を選択してください。");
            jobType.focus();
            return;
        }

        if (!employmentType.value) {
            alert("希望雇用形態を選択してください。");
            employmentType.focus();
            return;
        }

        if (!motivation.value.trim()) {
            alert("志望動機を入力してください。");
            motivation.focus();
            return;
        }

        window.location.href = "recruit-thanks.html";
    });
}