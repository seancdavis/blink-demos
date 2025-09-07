export function initHeaderDropdown() {
  const dropdown = document.querySelector('.header-auth-links') as HTMLDetailsElement

  if (dropdown) {
    // Close on outside click
    document.addEventListener('click', (e) => {
      if (e.target && !dropdown.contains(e.target as Node)) {
        dropdown.open = false
      }
    })

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && dropdown.open) {
        dropdown.open = false
      }
    })
  }
}
