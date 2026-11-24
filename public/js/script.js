// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})();

// Day / Night toggle
(function () {
  const html = document.documentElement;
  const btn  = document.getElementById("theme-toggle");
  const icon = document.getElementById("theme-icon");

  function applyTheme(theme) {
    html.setAttribute("data-bs-theme", theme);
    localStorage.setItem("wl-theme", theme);
    if (icon) {
      icon.className = theme === "dark" ? "fa-solid fa-sun text-warning" : "fa-regular fa-moon";
    }
  }

  // Sync icon with whatever theme is currently active (set by inline script in <head>)
  applyTheme(html.getAttribute("data-bs-theme") || "light");

  if (btn) {
    btn.addEventListener("click", function () {
      const current = html.getAttribute("data-bs-theme");
      applyTheme(current === "dark" ? "light" : "dark");
    });
  }
})();

// Auto-dismiss Bootstrap alerts after 5 seconds
const alerts = document.querySelectorAll('.alert');
if (alerts.length) {
  setTimeout(() => {
    alerts.forEach(alert => {
      const bsAlert = bootstrap.Alert.getOrCreateInstance(alert);
      if (bsAlert) bsAlert.close();
    });
  }, 5000);
}