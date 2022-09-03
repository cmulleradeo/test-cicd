export default (inputField) => {
  switch (inputField) {
    case 'ADEO_BusinessUnit:1': return '01. LM France'
    case 'ADEO_BusinessUnit:11': return '02. Weldom Integres'
    case 'ADEO_BusinessUnit:17': return '03. Weldom Services'
    case 'ADEO_BusinessUnit:2': return '04. LM Spain'
    case 'ADEO_BusinessUnit:12': return '05. Aki Spain'
    case 'ADEO_BusinessUnit:5': return '06. LM Italy'
    case 'ADEO_BusinessUnit:10': return '07. Bricocenter'
    case 'ADEO_BusinessUnit:9': return '08. LM Russia'
    case 'ADEO_BusinessUnit:6': return '09. LM Poland'
    case 'ADEO_BusinessUnit:7': return '10. LM Brazil'
    case 'ADEO_BusinessUnit:3': return '11. LM Portugal'
    case 'ADEO_BusinessUnit:13': return '12. Aki Portugal'
    case 'ADEO_BusinessUnit:19': return '13. LM Greece / Cyprus'
    case 'ADEO_BusinessUnit:53': return '14. LM South Africa'
    case 'ADEO_BusinessUnit:23': return '15. LM Ukraine'
    case 'ADEO_BusinessUnit:26': return '16. LM Romania'
    case 'ADEO_BusinessUnit:14': return '17. Bricoman Fr'
    case 'ADEO_BusinessUnit:20': return '18. Bricoman Pol'
    case 'ADEO_BusinessUnit:22': return '19. Bricoman It'
    case 'ADEO_BusinessUnit:18': return '20. Bricomart'
    case 'ADEO_BusinessUnit:38': return '22. Zodio Brazil'
    case 'ADEO_BusinessUnit:21': return '23. Zodio France'
    case 'ADEO_BusinessUnit:32': return '24. Zodio Italy'
    case 'ADEO_BusinessUnit:56': return '25. Alice Delice'
    default: return null
  }
}
