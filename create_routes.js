const fs = require('fs');
const path = require('path');

const routes = {
  '': 'Home',
  'login': 'Login',
  'admin-login': 'AdminLogin',
  'search': 'SearchResults',
  'item/[id]': 'ItemDetails',
  'post-ad': 'PostAd',
  'profile': 'UserProfile',
  'dashboard': 'AdminDashboard',
  'admin': 'AdminDashboard',
  'help': 'Help',
  'contact': 'Contact',
  'buying-guides': 'BuyingGuides',
  'safety-tips': 'SafetyTips',
  'selling-advice': 'SellingAdvice',
  'market-trends': 'MarketTrends',
  'terms': 'Terms',
  'payment-portal': 'PaymentPortal',
  'toronto-classifieds': 'TorontoClassifieds',
  'buy-and-sell-toronto': 'BuyAndSellToronto',
  'local-services-toronto': 'LocalServicesToronto',
  'jobs-toronto': 'JobsToronto',
  'real-estate-toronto': 'RealEstateToronto',
  'sri-lankan-marketplace-canada': 'SriLankanMarketplace'
};

const appDir = path.join(__dirname, 'src', 'app');

for (const [routePath, componentName] of Object.entries(routes)) {
  const targetDir = path.join(appDir, routePath);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const pageFile = path.join(targetDir, 'page.tsx');
  let content = '';

  if (routePath === '') {
    content = `
import ${componentName} from '@/old_pages/${componentName}';

export default function Page() {
  return <${componentName} isLoggedIn={false} />;
}
`;
  } else if (componentName === 'Login' || componentName === 'AdminLogin') {
    content = `
import ${componentName} from '@/old_pages/${componentName}';

export default function Page() {
  return <${componentName} onLogin={() => {}} />;
}
`;
  } else {
    content = `
import ${componentName} from '@/old_pages/${componentName}';

export default function Page() {
  return <${componentName} />;
}
`;
  }

  fs.writeFileSync(pageFile, content.trim() + '\n');
  console.log(`Created ${pageFile}`);
}
