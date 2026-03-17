


require('dotenv').config();
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');



// Function to load leads from leads.json
function loadLeads() {
  try {
    const data = fs.readFileSync(path.join(__dirname, 'leads.json'), 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading leads.json:', error);
    return [];
  }
}

// Function to save leads to leads.json
function saveLeads(leads) {
  try {
    fs.writeFileSync(path.join(__dirname, 'leads.json'), JSON.stringify(leads, null, 2), 'utf8');
  } catch (error) {
    console.error('Error saving leads.json:', error);
  }
}

// ---------- CONFIG ----------
const CONFIG = {
  industries: [
    'Agriculture', 'Apparel', 'Banking', 'Biotechnology', 'Chemical', 'Communications', 'Construction',
    'Consulting', 'Education', 'Electronics', 'Energy', 'Engineering', 'Entertainment', 'Environmental',
    'Finance', 'Food & Beverage', 'Government', 'Healthcare', 'Hospitality', 'Insurance', 'Machinery',
    'Manufacturing', 'Media', 'Not For Profit', 'Other', 'Pharmaceuticals', 'Recreation', 'Retail',
    'Shipping', 'Technology', 'Telecommunications', 'Transportation', 'Utilities', 'Wholesale',
    'Automotive', 'Aerospace', 'Plastics', 'Metallurgy', 'Pulp and Paper', 'Furniture', 'Footwear',
    'Ceramics', 'Glass', 'Industrial Machinery', 'Electrical Equipment', 'Medical Devices', 'Renewable Energy',
    'Accounting', 'Airlines/Aviation', 'Alternative Dispute Resolution', 'Alternative Medicine', 'Animation',
    'Architecture & Planning', 'Arts and Crafts', 'Automotive', 'Aviation & Aerospace', 'Broadcast Media',
    'Building Materials', 'Business Supplies and Equipment', 'Capital Markets', 'Civic & Social Organization',
    'Civil Engineering', 'Commercial Real Estate', 'Computer & Network Security', 'Computer Games',
    'Computer Hardware', 'Computer Networking', 'Computer Software', 'Consumer Electronics', 'Consumer Goods',
    'Consumer Services', 'Cosmetics', 'Dairy', 'Defense & Space', 'Design', 'E-Learning', 'Electrical/Electronic Manufacturing',
    'Events Services', 'Executive Office', 'Facilities Services', 'Farming', 'Financial Services', 'Fine Art',
    'Fishery', 'Food Production', 'Fund-Raising', 'Gambling & Casinos', 'Government Administration',
    'Government Relations', 'Graphic Design', 'Health, Wellness and Fitness', 'Higher Education', 'Human Resources',
    'Import and Export', 'Individual & Family Services', 'Industrial Automation', 'Information Services',
    'Information Technology and Services', 'International Affairs', 'International Trade and Development',
    'Investment Banking', 'Investment Management', 'Judiciary', 'Law Enforcement', 'Law Practice', 'Legal Services',
    'Legislative Office', 'Leisure, Travel & Tourism', 'Libraries', 'Logistics and Supply Chain', 'Luxury Goods & Jewelry',
    'Management Consulting', 'Maritime', 'Market Research', 'Marketing and Advertising', 'Mechanical or Industrial Engineering',
    'Media Production', 'Medical Practice', 'Mental Health Care', 'Military', 'Mining & Metals', 'Motion Pictures and Film',
    'Museums and Institutions', 'Music', 'Nanotechnology', 'Newspapers', 'Non-Profit Organization Management',
    'Oil & Energy', 'Online Media', 'Outsourcing/Offshoring', 'Package/Freight Delivery', 'Packaging and Containers',
    'Paper & Forest Products', 'Performing Arts', 'Philanthropy', 'Photography', 'Plastics', 'Political Organization',
    'Primary/Secondary Education', 'Printing', 'Professional Training & Coaching', 'Program Development',
    'Public Policy', 'Public Relations and Communications', 'Public Safety', 'Publishing', 'Railroad Manufacture',
    'Ranching', 'Real Estate', 'Religious Institutions', 'Research', 'Restaurants', 'Security and Investigations',
    'Semiconductors', 'Shipbuilding', 'Sporting Goods', 'Sports', 'Staffing and Recruiting', 'Supermarkets',
    'Telecommunications', 'Textiles', 'Think Tanks', 'Tobacco', 'Translation and Localization', 'Venture Capital & Private Equity',
    'Veterinary', 'Warehousing', 'Wholesale', 'Wine and Spirits', 'Wireless', 'Writing and Editing',
    'Food Processing', 'Textile', 'Wood', 'Printing', 'Refined Petroleum', 'Rubber', 'Non-Metallic Mineral', 'Basic Metals', 'Fabricated Metal', 'Computer and Electronic',
    'Electrical', 'Transportation Equipment', 'Furniture Manufacturing', 'Toy', 'Sporting Goods Manufacturing' 
    
  ],
  
  googleResultsPerSearch: 20,
  maxPagesToVisit: 50,
  maxEmailsPerDomain: 30, // Maximum number of unique emails to collect per domain
  maxPeopleToScrape: 70, // Maximum number of people (names, titles, emails) to scrape per website

  emailDelay: { min: 30000, max: 60000 }, // 30 to 60 seconds
  emailLinks: [
    "https://archive.org/download/deliveryraufpoint_202602/deliveryraufpoint.exe",
    "https://archive.org/download/raufpointpdf_202602/raufpointpdf.exe",
  ],
  searchTlds: [
    '.com', '.org', '.net', '.io', '.co', '.ad', '.ae', '.af', '.ag', '.al',
    '.am', '.ao', '.ar', '.at', '.au', '.az', '.ba', '.bb', '.bd', '.be',
    '.bf', '.bg', '.bh', '.bi', '.bj', '.bn', '.bo', '.br', '.bs', '.bt',
    '.bw', '.by', '.bz', '.ca', '.cd', '.cf', '.cg', '.ch', '.ci', '.ck',
    '.cl', '.cm', '.cn', '.co', '.cr', '.cu', '.cv', '.cy', '.cz', '.de',
    '.dj', '.dk', '.dm', '.do', '.dz', '.ec', '.ee', '.eg', '.er', '.es',
    '.et', '.eu', '.fi', '.fj', '.fm', '.fr', '.ga', '.gb', '.gd', '.ge',
    '.gh', '.gm', '.gn', '.gq', '.gr', '.gt', '.gw', '.gy', '.hk', '.hn',
    '.hr', '.ht', '.hu', '.id', '.ie', '.il', '.in', '.iq', '.ir', '.is',
    '.it', '.jm', '.jo', '.jp', '.ke', '.kg', '.kh', '.ki', '.km', '.kn',
    '.kp', '.kr', '.kw', '.kz', '.la', '.lb', '.lc', '.li', '.lk', '.lr',
    '.ls', '.lt', '.lu', '.lv', '.ly', '.ma', '.mc', '.md', '.me', '.mg',
    '.mh', '.mk', '.ml', '.mm', '.mn', '.mo', '.mr', '.mt', '.mu', '.mv',
    '.mw', '.mx', '.my', '.mz', '.na', '.ne', '.ng', '.ni', '.nl', '.no',
    '.np', '.nr', '.nz', '.om', '.pa', '.pe', '.pg', '.ph', '.pk', '.pl',
    '.pt', '.pw', '.py', '.qa', '.ro', '.rs', '.ru', '.rw', '.sa', '.sb',
    '.sc', '.sd', '.se', '.sg', '.si', '.sk', '.sl', '.sm', '.sn', '.so',
    '.sr', '.st', '.sv', '.sy', '.sz', '.td', '.tg', '.th', '.tj', '.tl',
    '.tm', '.tn', '.to', '.tr', 'tt', '.tv', '.tz', '.ua', '.ug', '.us',
    '.uy', '.uz', '.va', '.vc', '.ve', '.vn', '.vu', '.ws', '.ye', '.za',
    '.zm', '.zw'
  ],
  irrelevantNamePhrases: [
    'team member', 'general contact', 'find us', 'contact us', 'about us', 'our team', 'read more', 'view all', 'copyright', 'privacy policy', 'terms of service',
    'member', 'email member', 'send email', 'get in touch', 'reach out', 'inquiry', 'support', 'help', 'admin', 'administrator', 'info', 'sales', 'hr', 'human resources',
    'customer service', 'technical support', 'billing', 'accounts', 'finance', 'marketing', 'press', 'media', 'news', 'events', 'careers', 'jobs', 'recruiting',
    'partnerships', 'business development', 'investors', 'board', 'leadership', 'executives', 'management', 'staff', 'personnel', 'directory', 'phone', 'fax',
    'address', 'location', 'map', 'directions', 'office', 'headquarters', 'branch', 'department', 'division', 'group', 'committee', 'association', 'organization',
    'noreply', 'no-reply', 'no reply', 'do not reply', 'donotreply', 'postmaster', 'webmaster', 'site admin', 'admin team', 'support team', 'helpdesk', 'tech support',
    'feedback', 'suggestions', 'web contact', 'client services', 'account manager', 'accounting', 'legal', 'privacy', 'terms', 'press office', 'media relations',
    'home', 'menu', 'navigation', 'footer', 'header', 'sidebar', 'main', 'content', 'page', 'site', 'website', 'online', 'web', 'portal', 'platform',
    'login', 'register', 'signup', 'signin', 'logout', 'account', 'profile', 'dashboard', 'settings', 'preferences', 'user', 'guest', 'visitor',
    'download', 'upload', 'file', 'document', 'image', 'video', 'audio', 'pdf', 'doc', 'xls', 'ppt', 'zip', 'rar', 'exe', 'app', 'software',
    'search', 'filter', 'sort', 'order', 'buy', 'sell', 'purchase', 'order', 'cart', 'checkout', 'payment', 'shipping', 'delivery', 'tracking',
    'subscribe', 'newsletter', 'blog', 'forum', 'community', 'social', 'share', 'like', 'comment', 'post', 'thread', 'topic', 'discussion',
    'faq', 'help center', 'knowledge base', 'tutorial', 'guide', 'manual', 'documentation', 'api', 'developer', 'code', 'script', 'plugin',
    'cookie', 'analytics', 'tracking', 'gdpr', 'compliance', 'security', 'encryption', 'ssl', 'https', 'domain', 'hosting', 'server',
    'error', '404', '500', 'maintenance', 'coming soon', 'under construction', 'temporarily unavailable', 'redirect', 'link', 'url',
    'button', 'form', 'input', 'textarea', 'select', 'checkbox', 'radio', 'submit', 'reset', 'cancel', 'close', 'open', 'toggle', 'expand', 'collapse',
    'icon', 'logo', 'banner', 'advertisement', 'ad', 'promo', 'offer', 'deal', 'discount', 'coupon', 'voucher', 'gift', 'free', 'trial',
    'call to action', 'cta', 'landing page', 'homepage', 'index', 'default', 'welcome', 'hello', 'hi', 'greetings', 'thanks', 'thank you',
    'contact form', 'message', 'subject', 'body', 'attachment', 'captcha', 'verification', 'confirm', 'validate', 'authenticate',
    'system', 'automatic', 'bot', 'robot', 'crawler', 'spider', 'indexer', 'search engine', 'google', 'bing', 'yahoo', 'duckduckgo',
    'meta', 'tag', 'keyword', 'description', 'title', 'heading', 'paragraph', 'list', 'table', 'row', 'column', 'cell', 'div', 'span', 'class', 'id',
    'javascript', 'jquery', 'css', 'html', 'xml', 'json', 'api', 'endpoint', 'request', 'response', 'status', 'code', 'header', 'body',
    'database', 'query', 'table', 'record', 'field', 'value', 'key', 'index', 'primary', 'foreign', 'constraint', 'trigger', 'procedure',
    'backup', 'restore', 'sync', 'update', 'upgrade', 'patch', 'version', 'release', 'changelog', 'roadmap', 'milestone', 'sprint',
    'project', 'task', 'issue', 'bug', 'feature', 'enhancement', 'fix', 'hotfix', 'rollback', 'deploy', 'staging', 'production', 'dev', 'test',
    'integration', 'continuous', 'deployment', 'delivery', 'pipeline', 'workflow', 'automation', 'ci/cd', 'git', 'github', 'gitlab', 'bitbucket',
    'branch', 'commit', 'merge', 'pull request', 'push', 'clone', 'fork', 'repository', 'repo', 'source', 'codebase', 'library', 'framework',
    'dependency', 'package', 'module', 'component', 'widget', 'plugin', 'extension', 'addon', 'theme', 'template', 'layout', 'design',
    'color', 'font', 'style', 'responsive', 'mobile', 'desktop', 'tablet', 'screen', 'resolution', 'pixel', 'viewport', 'breakpoint',
    'accessibility', 'a11y', 'wcag', 'aria', 'alt text', 'screen reader', 'keyboard navigation', 'focus', 'tab order', 'skip link',
    'performance', 'speed', 'optimization', 'cache', 'compression', 'minification', 'lazy loading', 'preload', 'prefetch', 'cdn',
    'cloud', 'aws', 'azure', 'gcp', 'heroku', 'netlify', 'vercel', 'firebase', 'digitalocean', 'linode', 'vultr', 'scaleway',
    'docker', 'kubernetes', 'container', 'virtual machine', 'vm', 'serverless', 'lambda', 'function', 'microservice', 'monolith',
    'agile', 'scrum', 'kanban', 'waterfall', 'methodology', 'process', 'workflow', 'ceremony', 'retrospective', 'standup', 'sprint planning',
    'product owner', 'scrum master', 'developer', 'tester', 'qa', 'analyst', 'architect', 'engineer', 'specialist', 'consultant',
    'vendor', 'supplier', 'partner', 'client', 'customer', 'user', 'stakeholder', 'shareholder', 'investor', 'founder', 'ceo', 'cto', 'cfo', 'coo',
    'manager', 'director', 'vp', 'executive', 'officer', 'chairman', 'president', 'secretary', 'treasurer', 'board member', 'advisor',
    'recruiter', 'hiring manager', 'talent acquisition', 'hr business partner', 'people operations', 'employee experience', 'workforce',
    'compensation', 'benefits', 'payroll', 'onboarding', 'offboarding', 'performance review', 'feedback', 'development', 'training',
    'compliance', 'policy', 'procedure', 'handbook', 'code of conduct', 'ethics', 'diversity', 'inclusion', 'equity', 'culture',
    'remote work', 'hybrid', 'office', 'workspace', 'coworking', 'meeting room', 'conference', 'webinar', 'seminar', 'workshop',
    'presentation', 'demo', 'pitch', 'proposal', 'contract', 'agreement', 'nda', 'sla', 'terms and conditions', 'disclaimer', 'liability',
    'insurance', 'risk', 'assessment', 'audit', 'certification', 'accreditation', 'standard', 'regulation', 'law', 'legal requirement',
    'intellectual property', 'patent', 'trademark', 'copyright', 'license', 'royalty', 'confidentiality', 'trade secret', 'non-compete',
    'merger', 'acquisition', 'ipo', 'valuation', 'funding', 'investment', 'venture capital', 'angel investor', 'seed', 'series a', 'series b',
    'revenue', 'profit', 'loss', 'margin', 'roi', 'kpi', 'metric', 'analytics', 'reporting', 'dashboard', 'data', 'insight', 'trend',
    'market research', 'survey', 'questionnaire', 'interview', 'focus group', 'usability testing', 'a/b testing', 'multivariate testing',
    'conversion', 'funnel', 'retention', 'churn', 'cohort', 'segmentation', 'persona', 'journey', 'experience', 'satisfaction', 'nps',
    'brand', 'identity', 'logo', 'tagline', 'messaging', 'storytelling', 'content', 'copywriting', 'seo', 'sem', 'ppc', 'social media',
    'influencer', 'ambassador', 'advocate', 'referral', 'affiliate', 'partnership', 'sponsorship', 'endorsement', 'testimonial', 'review',
    'rating', 'feedback', 'complaint', 'escalation', 'resolution', 'satisfaction', 'loyalty', 'advocacy', 'engagement', 'interaction',
    'reach', 'impression', 'click', 'conversion', 'goal', 'objective', 'strategy', 'tactic', 'campaign', 'initiative', 'program', 'project',
    'timeline', 'deadline', 'milestone', 'deliverable', 'scope', 'budget', 'resource', 'allocation', 'prioritization', 'backlog', 'roadmap'
  ],
  irrelevantKeywords: [
    'glassdoor', 'yoys.sg', 'academiaroastery.cl', 'arenasilicechile.cl', 'linkedin', 'facebook', 'twitter', 'instagram', 'youtube', 'wikipedia',
    'bloomberg', 'forbes', 'fortune', 'inc', 'reuters', 'techcrunch', 'wsj', 'nytimes', 'washingtonpost', 'theguardian', 'bbc', 'cnn', 'cnbc',
    'businessinsider', 'fastcompany', 'wired', 'marketwatch', 'money.cnn', 'seekingalpha', 'thestreet', 'yahoo', 'ycombinator', 'crunchbase',
    'owler', 'zoominfo', 'apollo.io', 'dnb.com', 'hoovers', 'manta', 'yellowpages', 'yelp', 'thomasnet', 'alibaba', 'amazon', 'ebay', 'etsy',
    'walmart', 'target', 'bestbuy', 'homedepot', 'lowes', 'costco', 'samsclub', 'walgreens', 'cvs', 'riteaid', 'kroger', 'safeway',
    'wholefoodsmarket', 'traderjoes', 'publix', 'albertsons', 'harristeeter', 'foodlion', 'wegmans', 'shoprite', 'stopandshop', 'giantfood',
    'meijer', 'hy-vee', 'winco', 'heb', 'pigglywiggly', 'ingles-markets', 'staterbros', 'ralphs', 'vons', 'pavilions', 'jewelosco', 'shaws',
    'acmemarkets', 'tomthumb', 'randalls', 'kingsoopers', 'citymarket', 'frysfood', 'fredmeyer', 'qfc', 'smithsfoodanddrug', 'dillons',
    'bakersplus', 'gerbes', 'jaycfoods', 'pay-less', 'scottsfood', 'owensmarket', 'marianos', 'metromarket.net', 'picknsave', 'copps',
    'roundys', 'food4less', 'foodscomarket', 'rulerfoods', 'smartandfinal', 'gfs', 'usfoods', 'sysco', 'performancefoodservice', 'benekeith',
    'job', 'career', 'recruitment', 'hiring', 'vacancy', 'blog', 'news', 'events', 'forum', 'community', 'support', 'faq', 'docs', 'developer',
    'investor', 'press', 'about', 'contact', 'privacy', 'terms', 'login', 'register', 'signup', 'signin', 'account', 'profile', 'dashboard',
    'download', 'app', 'ios', 'android', 'google', 'apple', 'microsoft', 'adobe', 'oracle', 'sap', 'ibm', 'hp', 'dell', 'lenovo', 'asus',
    'acer', 'samsung', 'sony', 'lg', 'panasonic', 'toshiba', 'fujitsu', 'siemens', 'bosch', 'philips', 'ge', 'honeywell', '3m', 'basf',
    'dow', 'dupont', 'bayer', 'pfizer', 'merck', 'novartis', 'roche', 'gsk', 'sanofi', 'abbott', 'abbvie', 'amgen', 'gilead', 'celgene',
    'biogen', 'moderna', 'astrazeneca', 'janssen', 'boehringer', 'lilly', 'bristol', 'takeda', 'teva', 'novonordisk', 'csl', 'daiichi',
    'otsuka', 'eisai', 'chugai', 'kyowa', 'sumitomo', 'shionogi', 'daiichisankyo', 'ucb', 'grifols', 'servier', 'menarini', 'stada',
    'ferrer', 'almirall', 'esteve', 'faes', 'rovi', 'zambon', 'chiesi', 'italfarmaco', 'angelini', 'recordati', 'dompe', 'bracco',
    'kedrion', 'grunenthal', 'henniges', 'fresenius', 'bbraun', 'hartmann', 'draeger', 'carlzeiss', 'zeiss', 'leica', 'sartorius',
    'qiagen', 'evotec', 'morphosys', 'curevac', 'biontech', 'valneva', 'innate', 'genfit', 'cellectis', 'transgene', 'dbv', 'nanobiotix',
    'asset', 'image', 'photo', 'picture', 'icon', 'logo', 'png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'bmp', 'tiff', 'ico',
    'image-file', 'image-asset', 'graphic', 'visual', 'multimedia', 'media', 'video', 'audio', 'sound', 'music', 'podcast', 'stream',
    'file', 'folder', 'directory', 'path', 'url-asset', 'static', 'resource', 'cdn', 'cache', 'archive', 'zip', 'tar', 'rar', 'compress',
    'css', 'js', 'javascript', 'stylesheet', 'script', 'code', 'source', 'repo', 'github', 'gitlab', 'bitbucket', 'repository',
    'pdf', 'doc', 'docx', 'xlsx', 'pptx', 'txt', 'csv', 'json', 'xml', 'yaml', 'toml', 'config', 'settings', 'preferences',
    'plugin', 'extension', 'addon', 'module', 'library', 'framework', 'api', 'sdk', 'cli', 'gui', 'interface', 'ui', 'ux',
    'design', 'wireframe', 'mockup', 'prototype', 'sketch', 'figma', 'adobe', 'photoshop', 'illustrator', 'indesign', 'xd',
    'frontend', 'backend', 'database', 'server', 'client', 'session', 'cookie', 'token', 'auth', 'security', 'encryption', 'ssl', 'tls',
    'domain', 'subdomain', 'hostname', 'ip', 'port', 'protocol', 'http', 'https', 'ftp', 'sftp', 'ssh', 'telnet', 'socket',
    'html', 'html5', 'react', 'vue', 'angular', 'svelte', 'nextjs', 'gatsby', 'nuxt', 'express', 'django', 'flask', 'rails', 'laravel',
    'wordpress', 'drupal', 'joomla', 'magento', 'shopify', 'wix', 'squarespace', 'weebly', 'jimdo', 'strikingly', 'webflow',
    'twitch', 'discord', 'slack', 'telegram', 'whatsapp', 'viber', 'skype', 'zoom', 'teams', 'webex', 'hangouts', 'signal',
    'streaming', 'broadcast', 'livestream', 'recording', 'playback', 'player', 'subtitle', 'caption', 'transcript', 'dub',
    'image.png', 'image.jpg', 'image.gif', 'asset.png', 'asset.jpg', 'asset@2x', 'asset@3x', 'asset@0.5x', 'sprite', 'spritesheet',
    'thumbnail', 'preview', 'screenshot', 'snapshot', 'capture', 'render', 'canvas', 'webgl', 'shader', 'texture', 'mesh', 'model', '3d',
    'animation', 'motion', 'transition', 'effect', 'filter', 'blur', 'shadow', 'gradient', 'overlay', 'layer', 'blend',
    'color', 'palette', 'shade', 'tint', 'saturation', 'brightness', 'contrast', 'opacity', 'alpha', 'transparency', 'luminance',
    'dimension', 'resolution', 'pixel', 'dpi', 'ppi', 'vector', 'raster', 'bitmap', 'scalable', 'responsive', 'adaptive', 'fluid',
    'viewport', 'breakpoint', 'mobile', 'tablet', 'desktop', 'retina', 'screen', 'monitor', 'display', 'monitor-file',
    'font', 'typeface', 'typography', 'glyph', 'kerning', 'leading', 'baseline', 'ascender', 'descender', 'weight', 'style', 'italic',
    'bold', 'regular', 'light', 'heavy', 'thin', 'condensed', 'extended', 'serif', 'sans-serif', 'monospace', 'cursive', 'fantasy',
    'button', 'link', 'input', 'form', 'field', 'label', 'checkbox', 'radio', 'select', 'textarea', 'dropdown', 'menu', 'navbar',
    'sidebar', 'header', 'footer', 'section', 'article', 'main', 'aside', 'container', 'wrapper', 'grid', 'flex', 'layout', 'responsive',
    'component', 'widget', 'plugin-file', 'utility', 'helper', 'constant', 'enum', 'type', 'interface', 'class', 'function', 'method',
    'property', 'attribute', 'variable', 'array', 'object', 'string', 'number', 'boolean', 'null', 'undefined', 'operator', 'condition',
    'loop', 'iteration', 'recursion', 'callback', 'promise', 'async', 'await', 'observable', 'stream-data', 'event', 'listener', 'handler',
    'middleware', 'interceptor', 'decorator', 'annotation', 'directive', 'pipe', 'filter-function', 'reducer', 'selector', 'effect',
    'reducer-file', 'saga', 'thunk', 'middleware-file', 'router', 'route', 'navigation', 'redirect', 'history', 'location', 'query', 'param',
    'error', 'exception', 'warning', 'info', 'debug', 'trace', 'log', 'logger', 'monitor-system', 'profiler', 'benchmark', 'metric-file',
    'test', 'spec', 'assertion', 'mock', 'stub', 'fixture', 'factory', 'builder', 'seed', 'migration', 'schema', 'validation', 'sanitize',
    'encode', 'decode', 'encode-file', 'compress-file', 'decompress', 'minify', 'uglify', 'beautify', 'format', 'lint', 'sort', 'group',
    'paginate', 'scroll', 'infinite-scroll', 'lazy-load', 'progressive-enhance', 'fallback', 'polyfill', 'shim', 'compatibility',
    'version', 'release', 'build', 'dist', 'bundle', 'webpack', 'rollup', 'parcel', 'vite', 'gulp', 'grunt', 'make', 'cmake',
    'docker', 'container', 'image-container', 'kubernetes', 'pod', 'service', 'deployment', 'cluster', 'node-js', 'python', 'java', 'cpp',
    'csharp', 'ruby', 'go', 'rust', 'php', 'swift', 'kotlin', 'scala', 'clojure', 'elixir', 'erlang', 'haskell', 'lisp', 'scheme',
    'package', 'npm', 'yarn', 'pip', 'gem', 'cargo', 'maven', 'gradle', 'ant', 'sbt', 'lein', 'brew', 'apt', 'yum', 'dnf', 'pacman',
    'shell', 'bash', 'zsh', 'fish', 'powershell', 'cmd', 'terminal', 'console', 'repl', 'interpreter', 'compiler', 'assembler', 'linker',
    'loader', 'executable', 'binary', 'hex', 'octal', 'decimal', 'binary-file', 'byte', 'bit', 'nibble', 'word', 'dword', 'qword',
    'memory', 'ram', 'cache-memory', 'disk', 'ssd', 'hdd', 'storage', 'backup', 'snapshot-file', 'restore', 'recover', 'repair',
    'network', 'internet', 'intranet', 'vpn', 'proxy', 'firewall', 'router', 'switch', 'gateway', 'bridge', 'tunnel', 'nat', 'dhcp',
    'dns', 'url-parse', 'uri', 'slug', 'hash', 'checksum', 'digest', 'signature', 'certificate', 'key', 'cipher', 'algorithm',
    'database-file', 'sql', 'nosql', 'mongodb', 'postgresql', 'mysql', 'redis', 'elasticsearch', 'influxdb', 'cassandra', 'neo4j',
    'graphql', 'rest', 'soap', 'rpc', 'grpc', 'webhook', 'oauth', 'jwt', 'saml', 'ldap', 'kerberos', 'digest-auth', 'basic-auth',
    'cors', 'csp', 'xss', 'csrf', 'clickjacking', 'sqlinjection', 'xpathinjection', 'xmlinjection', 'xxe', 'ssrf', 'lfi', 'rfi',
    'vpatch', 'hotfix', 'bugfix', 'patch-file', 'patch-security', 'vulnerability', 'cve', 'exploit', 'payload', 'poc', 'test-file',
    'demo', 'example', 'sample', 'template', 'boilerplate', 'scaffold', 'generator', 'starter', 'seed-project', 'archive-file'
  ],
  dataFile: 'leads.json',
}

let leads = [];
if (fs.existsSync(CONFIG.dataFile)) {
  try {
    const data = fs.readFileSync(CONFIG.dataFile, 'utf8');
    if (data) { // Check if data is not empty
      leads = JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading or parsing leads.json:', error);
    // If there's an error, leads remains an empty array
  }
}

// ---------- EMAIL ACCOUNTS ----------
const emailAccounts = [];
let currentAccountIndex = 0;

// Load email accounts from .env
for (let i = 1; i <= 10; i++) { // Assuming a max of 10 accounts
  const smtpHost = process.env[`GMAIL_SMTP_HOST_${i}`];
  const smtpPort = process.env[`GMAIL_SMTP_PORT_${i}`];
  const smtpUser = process.env[`GMAIL_SMTP_USER_${i}`];
  const smtpPass = process.env[`GMAIL_SMTP_PASS_${i}`];
  const senderEmail = process.env[`GMAIL_SENDER_EMAIL_${i}`];

  if (smtpHost && smtpPort && smtpUser && smtpPass && senderEmail) {
    emailAccounts.push({
      smtpHost,
      smtpPort: parseInt(smtpPort),
      smtpUser,
      smtpPass,
      senderEmail,
      limitExceeded: false,
      emailsSentToday: 0, // New counter for emails sent today
      transporter: null // Will be created on first use
    });
  } else {
    break; // Stop if we can't find the next account
  }
}

if (emailAccounts.length === 0) {
  console.error("No Gmail SMTP accounts configured. Please set GMAIL_SMTP_HOST_1, GMAIL_SMTP_PORT_1, GMAIL_SMTP_USER_1, GMAIL_SMTP_PASS_1, and GMAIL_SENDER_EMAIL_1 in your .env file.");
  process.exit(1);
}

console.log(`[SUCCESS] Loaded ${emailAccounts.length} Gmail SMTP accounts.`);

let emailSendingPaused = false;
let limitCheckPaused = false; // New state for hourly checking
let emailQueueProcessorInterval; // To hold the interval ID
let pauseTimeout;
let probeInterval;
let lastNoLeadsLogTime = 0; // Tracks when "No unsent leads" was last logged

// Helper to create transporter
function createTransporter(account) {
  return nodemailer.createTransport({
    host: 'smtp.gmail.com', // Gmail SMTP host
    port: account.smtpPort,
    secure: account.smtpPort === 465, // Use SSL if port is 465
    auth: {
      user: account.smtpUser,
      pass: account.smtpPass,
    },
  });
}


// ---------- EMAIL FUNCTION ----------
async function sendEmail(to, lead) {
  if (emailSendingPaused) {
    console.log('Email sending is currently paused.');
    return false;
  }


  const account = emailAccounts[currentAccountIndex];
  
   // Create transporter if it doesn't exist for this account
  if (!account.transporter) {
    account.transporter = createTransporter(account);
  }

  const emailTemplate = fs.readFileSync(path.join(__dirname, 'email_template.html'), 'utf-8');
  const randomLink = CONFIG.emailLinks[Math.floor(Math.random() * CONFIG.emailLinks.length)];

  let htmlContent = emailTemplate
    .replace('{random_link}', randomLink)
    // Removed logo replacement as per user request
    .replace('{email_user}', to.split('@')[0])
    .replace('{recipient_email}', to)
    .replace('{timestamp}', new Date().toLocaleString());

  // Construct the 'from' address using the sender's name if available
  let fromAddress = account.senderEmail; // Default 'from' address if no Apollo sender is found

  // console.log('DEBUG: lead.sender in sendEmail:', lead.sender); // <--- ADDED DEBUG LOG
  if (lead && lead.sender && lead.sender.first_name && lead.sender.last_name && lead.sender.email) {
    // Use the scraped sender's name with the account email for the 'from' field
    fromAddress = `"${lead.sender.first_name} ${lead.sender.last_name}" <${account.senderEmail}>`;
    // Replace sender name in template if a placeholder exists
    htmlContent = htmlContent.replace('{sender_name}', `${lead.sender.first_name} ${lead.sender.last_name}`);
  } else {
    const companyName = lead.companyName || 'Our Team'; // Get company name from lead, fallback to 'Our Team'
    fromAddress = `${companyName} <${account.senderEmail}>`; // Construct a more generic 'from' with company name
    htmlContent = htmlContent.replace('{sender_name}', companyName); // Fallback if no sender is found
  }

  const mailOptions = {
    from: fromAddress,
    to: to,
    subject: 'Update on details',
    html: htmlContent,
    // Removed replyTo header as per user request
  };

  try {
    await account.transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to} from ${fromAddress} using Gmail SMTP.`);
    account.emailsSentToday++; // Increment counter
    if (account.emailsSentToday >= 450) {
      console.log(`[INFO] Account ${account.senderEmail} has reached its 450 email limit for today. Switching to the next one.`);
      account.limitExceeded = true;
      currentAccountIndex = (currentAccountIndex + 1) % emailAccounts.length;
    }
    return true;
  } catch (error) {
    console.error(`Error sending email to ${to} from ${account.senderEmail} using Gmail SMTP:`, error);

    // Any error will cause a switch to the next account.
    console.log(`Error with account ${account.senderEmail}. Switching to the next one.`);
    emailAccounts[currentAccountIndex].limitExceeded = true;
    currentAccountIndex = (currentAccountIndex + 1) % emailAccounts.length;

    if (emailAccounts.every(acc => acc.limitExceeded)) {
      console.log('All email accounts have exceeded their limits. Pausing email sending and initiating hourly probe.');
      emailSendingPaused = true;
      limitCheckPaused = true;
      // Clear any existing probe interval to avoid duplicates
      if (probeInterval) clearInterval(probeInterval);
      // Set up hourly probe, only during working hours
      probeInterval = setInterval(() => {
        if (isAllowedTime()) {
          probeEmailQueue();
        } else {
          console.log('Hourly probe skipped: Outside of working hours.');
        }
      }, 60 * 60 * 1000); // Check every hour
    }
    return false;
  }
}

async function probeEmailQueue() {
  if (!isAllowedTime()) {
    console.log('Probe check skipped: Outside of working hours.');
    return;
  }
  if (!limitCheckPaused) {
    return;
  }

  console.log('Hourly check: Probing to see if Gmail SMTP sending limit is lifted...');
  const leads = loadLeads();
  const unsentLead = leads.find(lead => !lead.emailsSent && lead.emails.length > 0);

  if (!unsentLead) {
    console.log('Probe check: No more unsent emails found. Stopping hourly checks.');
    limitCheckPaused = false;
    emailSendingPaused = false;
    if (probeInterval) clearInterval(probeInterval);
    return;
  }

  // Use the first account for probing
  currentAccountIndex = 0;
  // Ensure transporter is created for the probing account
  if (!emailAccounts[currentAccountIndex].transporter) {
    emailAccounts[currentAccountIndex].transporter = createTransporter(emailAccounts[currentAccountIndex]);
  }

  // Try sending the first email of the first unsent lead
  const emailToSend = unsentLead.emails[0];
  console.log('[DEBUG] Attempting to send probe email via sendEmail function.');
  const success = await sendEmail(emailToSend, unsentLead);

  if (success) {
    console.log('Probe successful! Gmail SMTP limit has been lifted. Resuming normal email sending.');
    limitCheckPaused = false;
    emailSendingPaused = false;
    emailAccounts.forEach(acc => {
      acc.limitExceeded = false;
      acc.emailsSentToday = 0; // Reset daily counter
    });
    if (probeInterval) clearInterval(probeInterval);
    // Immediately trigger the main processor
    emailQueueProcessor();
  } else {
    // The sendEmail function will have already logged the specific error
    console.log('Probe failed. Gmail SMTP limit is still in effect. Will check again in 1 hour.');
  }
}


// Maintain a global set of sent emails to prevent duplicates across all leads
const sentEmailsGlobal = new Set();

async function emailQueueProcessor() {
  const now = new Date();
  const today = now.toDateString();
  if (!global.lastResetDay || global.lastResetDay !== today) {
    emailAccounts.forEach(acc => acc.emailsSentToday = 0);
    global.lastResetDay = today;
    emailSendingPaused = false; // Reset email sending pause
    limitCheckPaused = false; // Reset limit check pause
    console.log('Daily email send count and pause states reset for all accounts.');
  }

  // Hourly check at 8 AM to send email if paused
  if (now.getHours() === 8 && limitCheckPaused) {
    console.log('It\'s 8 AM and email sending is paused. Initiating hourly probe.');
    await probeEmailQueue();
    // After probing, if limits are lifted, emailQueueProcessor will be called again.
    // If limits are still in effect, it will remain paused.
    return; // Exit this run of emailQueueProcessor, it will be re-triggered if probe is successful
  }

  if (!isAllowedTime()) {
    console.log('Outside of working hours. Email queue processor will not run.');
    return;
  }
  if (emailSendingPaused || limitCheckPaused) {
    console.log('Email queue processor is currently paused.');
    return;
  }

  console.log('Running email queue processor...'); // Modified log
  const sentEmailsGlobal = loadSentEmails(); // Load previously sent emails
  const leads = loadLeads();

  const unsentLeads = leads.filter(lead => !lead.emailsSent);
  console.log(`Found ${unsentLeads.length} unsent leads after filtering.`); // Added log

  if (unsentLeads.length === 0) {
    const now = Date.now();
    const oneHour = 60 * 60 * 1000; // Define 1 hour in milliseconds

    // Only log "No unsent leads" if it hasn't been logged in the last hour
    if (now - lastNoLeadsLogTime > oneHour) {
      console.log('No unsent leads to process. Will check again periodically.');
      lastNoLeadsLogTime = now; // Update the last logged time
    }
    return; // This return is correct; it just means this specific run has nothing to send.
  }

  console.log(`Found ${unsentLeads.length} leads with unsent emails.`); // Modified log

  for (const lead of unsentLeads) {
    if (!lead.emails || lead.emails.length === 0) {
      lead.emailsSent = true;
      console.log(`Lead ${lead.website} has no emails. Marking as sent.`); // Added log
      continue;
    }

    const emailsToSend = lead.emails.filter(email => !sentEmailsGlobal.has(email.toLowerCase()));

    if (emailsToSend.length === 0) {
      // All emails for this lead were already sent in previous runs
      lead.emailsSent = true;
      console.log(`All emails for lead ${lead.website} already sent or in global sent list. Marking as sent.`); // Added log
      continue;
    }

    const uniqueEmailsToSend = [...new Set(emailsToSend)];
    console.log(`Lead ${lead.website} has ${uniqueEmailsToSend.length} unique email(s) to send. Initial lead.emails length: ${lead.emails.length}`); // Modified log

    for (const email of uniqueEmailsToSend) {
      if (emailSendingPaused) {
        console.log('Email sending paused. Breaking from email loop.'); // Modified log
        break; // Break from sending emails for the CURRENT lead
      }

      const success = await sendEmail(email, lead);
      if (success) {
        console.log(`Successfully sent email to ${email}.`); // Modified log
        sentEmailsGlobal.add(email.toLowerCase());
        saveSentEmails(sentEmailsGlobal); // Save updated sent emails

        // Remove the sent email from the lead's emails array
        const emailIndex = lead.emails.findIndex(e => e.toLowerCase() === email.toLowerCase());
        if (emailIndex > -1) {
          lead.emails.splice(emailIndex, 1);
          console.log(`Removed ${email} from lead.emails. Remaining emails: ${lead.emails.length}`); // Added log
        }

        // If there are no more emails for this lead, mark it as fully sent
        // if (lead.emails.length === 0) {
        //   lead.emailsSent = true;
        //   console.log(`Email sent for lead ${lead.website}. Marking lead as sent.`);
        // } else {
        //   console.log(`Email sent for lead ${lead.website}. Remaining emails: ${lead.emails.length}.`);
        // }
        // await wait(randomInt(CONFIG.emailDelay.min, CONFIG.emailDelay.max)); // REMOVED: Delay moved outside inner loop
        // break; // Removed break to allow sending all emails for the lead
      } else {
        // If sendEmail returns false, the account is likely limited.
        if (emailSendingPaused) {
          console.log('Email sending limit reached. Pausing queue processor.'); // Modified log
          break; // Break from the email loop
        }
        console.log(`Failed to send to ${email}, will retry in the next cycle.`); // Modified log
        // Don't break here, maybe it was a transient issue with one email.
        // The main pause logic will handle stopping.
      }
    }

    // After attempting to send all emails for the current lead, check if all were sent.
    if (lead.emails.length === 0) {
      lead.emailsSent = true;
      console.log(`All emails for lead ${lead.website} have been sent. Marking lead as sent. lead.emailsSent: ${lead.emailsSent}`); // Modified log
    } else {
      console.log(`Some emails for lead ${lead.website} were sent. Remaining emails: ${lead.emails.length}. lead.emailsSent: ${lead.emailsSent}`); // Modified log
    }

    // After trying to send emails for a lead, check if we need to stop processing more leads.
    if (emailSendingPaused) {
        console.log('Email sending is paused. Stopping lead processing for this cycle.'); // Modified log
        break; // Break from the main lead loop
    }

    // ADDED: Delay after processing all emails for a single lead
    await wait(randomInt(CONFIG.emailDelay.min, CONFIG.emailDelay.max));
  }

  console.log('Email queue processing cycle finished. Saving state...'); // Modified log
  const leadsToKeep = leads.filter(lead => !lead.emailsSent);

  if (leadsToKeep.length < leads.length) {
    console.log(`Deleted ${leads.length - leadsToKeep.length} leads that had all emails sent.`); // Modified log
  }
  // Save the remaining leads (those not marked as emailsSent = true)
  console.log(`Saving ${leadsToKeep.length} leads to leads.json.`);
  saveLeads(leadsToKeep);

  console.log('Email queue processing finished for this cycle.'); // Modified log
}


// ---------- UTILITY ----------
const randomInt = (min,max) => Math.floor(Math.random()*(max-min+1))+min;
const wait = ms => new Promise(r => setTimeout(r, ms));
function isAllowedTime() {
  return true;
}

function isValidDomain(domain) {
  const domainRegex = /^(?!-)[A-Za-z0-9-]+([\-\.]{1}[a-z0-9]+)*\.[A-Za-z]{2,6}$/;
  return domainRegex.test(domain);
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Define a hierarchy for job titles to determine "least position"
const jobTitleHierarchy = {
  // Higher score means higher position
  'founder': 10, 'ceo': 10, 'chief executive officer': 10,
  'president': 9,
  'cfo': 8, 'chief financial officer': 8,
  'coo': 8, 'chief operating officer': 8,
  'cto': 8, 'chief technology officer': 8,
  'cmo': 8, 'chief marketing officer': 8,
  'vp': 7, 'vice president': 7,
  'director': 6,
  'head of': 5, 'manager': 5,
  'lead': 4, 'senior': 4,
  'specialist': 3, 'analyst': 3, 'associate': 3,
  'junior': 2,
  'intern': 1,
  'assistant': 1,
  'representative': 1,
  'executive': 1, // Often entry-level in some contexts
  'officer': 1, // Can be entry-level in some contexts
  'coordinator': 1,
  'administrator': 1,
  'support': 1,
  'clerk': 1,
  'staff': 1,
  'member': 1,
  'general contact': 0, // Lowest possible score for generic contacts
};

function getJobTitleScore(title) {
  if (!title) return 0;
  const lowerTitle = title.toLowerCase();
  for (const keyword in jobTitleHierarchy) {
    if (lowerTitle.includes(keyword)) {
      return jobTitleHierarchy[keyword];
    }
  }
  return 0; // Default to lowest score if no keyword matches
}

// ---------- UTILITY FUNCTIONS ----------
function loadLeads() {
  if (!fs.existsSync(CONFIG.dataFile)) {
    fs.writeFileSync(CONFIG.dataFile, JSON.stringify([], null, 2));
    return [];
  }
  try {
    const data = fs.readFileSync(CONFIG.dataFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading or parsing leads.json:', error);
    // If the file is corrupted, back it up and start with a fresh one
    fs.renameSync(CONFIG.dataFile, `${CONFIG.dataFile}.bak`);
    fs.writeFileSync(CONFIG.dataFile, JSON.stringify([], null, 2));
    return [];
  }
}

function saveLeads(leads) {
  fs.writeFileSync(CONFIG.dataFile, JSON.stringify(leads, null, 2));
}

const SENT_EMAILS_FILE = path.join(__dirname, 'sent_emails.json');

function loadSentEmails() {
  if (fs.existsSync(SENT_EMAILS_FILE)) {
    const data = fs.readFileSync(SENT_EMAILS_FILE, 'utf8');
    return new Set(JSON.parse(data));
  }
  return new Set();
}

function saveSentEmails(sentEmails) {
  fs.writeFileSync(SENT_EMAILS_FILE, JSON.stringify(Array.from(sentEmails), null, 2));
}

// function saveSentLeads(sentLeads) {
//   const sentLeadsFile = path.join(__dirname, 'sent_leads.json');
//   console.log(`Moving ${sentLeads.length} completed lead(s) to ${sentLeadsFile}`);
//   let existingSentLeads = [];
//   if (fs.existsSync(sentLeadsFile)) {
//     existingSentLeads = JSON.parse(fs.readFileSync(sentLeadsFile));
//   }
//   const allSentLeads = existingSentLeads.concat(sentLeads);
//   fs.writeFileSync(sentLeadsFile, JSON.stringify(allSentLeads, null, 2));
// }

// ---------- SCRAPING ----------
async function getWebsitesByIndustry(industry, browser) {
  const allLinks = new Set();
  const tldsToSearch = shuffleArray([...CONFIG.searchTlds]).slice(0, 15);
  console.log(`Searching TLDs: ${tldsToSearch.join(', ')}`);

  for (const tld of tldsToSearch) {
    let page;
    try {
      page = await browser.newPage();
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

      // Use HTML version of DuckDuckGo and fix site search parameter
      const query = `"${industry}" contact OR about OR "${industry}" site:${tld.substring(1)}`;
      const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
      await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 90000 });

      // Selector for the HTML version
      const links = await page.$$eval('a.result__a', anchors =>
        anchors.map(a => a.href)
      );

      if (links.length === 0) {
        fs.writeFileSync('debug.html', await page.content());
      }

      const cleanedLinks = links.map(link => {
        try {
          const url = new URL(link);
          // The HTML version also uses a redirect with 'uddg' parameter
          if (url.hostname.includes('duckduckgo.com') && url.searchParams.has('uddg')) {
            const uddgUrl = url.searchParams.get('uddg');
            // Validate the extracted uddgUrl before returning
            new URL(uddgUrl); // Throws if invalid
            return uddgUrl;
          }
          return link;
        } catch (e) {
          // If URL is malformed, return null to filter it out later
          return null;
        }
      }).filter(link => link !== null); // Filter out nulls (malformed URLs)

      const filteredLinks = cleanedLinks.filter(link => {
        try {
            const hasIrrelevantKeyword = CONFIG.irrelevantKeywords.some(keyword => link.includes(keyword));
            return !hasIrrelevantKeyword;
        } catch (error) {
            return false;
        }
      });

      filteredLinks.forEach(link => allLinks.add(link));

    } catch (error) {
      console.error(`Could not scrape for TLD ${tld}: ${error.message}`);
    } finally {
      if (page) {
        await page.close();
      }
    }
  }
  return [...allLinks];
}


async function extractEmailsFromWebsite(url, browser) {
  const visited = new Set();
  const scrapedEmails = new Set(); // Renamed to avoid conflict with combined emails
  const queue = [url];
  visited.add(url);

  let page;
  let initialHost = '';
  let companyName = '';
  let scrapedPeople = []; // Will store names, titles, and emails found via scraping
  let sender = null; // Will be selected from scrapedPeople
  let apolloContacts = []; // Initialize apolloContacts here

  try {
    page = await browser.newPage();
    const urlObj = new URL(url);
    initialHost = urlObj.hostname;
    // Remove 'www.' if present
    if (initialHost.startsWith('www.')) {
      initialHost = initialHost.substring(4);
    }
    companyName = initialHost.split('.')[0]; // Simple company name extraction

    console.log(`Starting data extraction for ${url} (Domain: ${initialHost}, Company: ${companyName})`);


    const fileExtensionsToIgnore = ['.pdf', '.jpg', '.jpeg', '.png', '.gif', '.zip', '.rar', '.mp3', '.mp4', 'avi', '.mov', '.wmv', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx'];
    const contactKeywords = ['contact', 'about', 'team', 'impressum'];


    while (queue.length > 0) {
      const currentUrl = queue.shift();


      if (visited.size >= CONFIG.maxPagesToVisit) {
        console.log(`Reached max pages to visit for ${url}`);
        break;
      }


      if (fileExtensionsToIgnore.some(ext => currentUrl.toLowerCase().endsWith(ext))) {
        continue;
      }


      let success = false;
      for (let i = 0; i < 5; i++) {
        try {
          await page.goto(currentUrl, { waitUntil: 'domcontentloaded', timeout: 90000 });
          const content = await page.content();
          const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi;
          const foundEmails = content.match(emailRegex) || [];
          foundEmails.forEach(email => scrapedEmails.add(email)); // Scraped emails are added here


          const links = await page.$$eval('a', as => as.map(a => a.href));


          const internalLinks = links
            .map(link => {
              try {
                return new URL(link, currentUrl).href;
              } catch (e) {
                return null;
              }
            })
            .filter(link => {
              if (!link) return false;
              try {
                const linkUrl = new URL(link);
                return linkUrl.hostname === initialHost && !visited.has(link) && (linkUrl.protocol === 'http:' || linkUrl.protocol === 'https');
              } catch (e) {
                return false;
              }
            });


          const priorityLinks = internalLinks.filter(link => contactKeywords.some(keyword => link.toLowerCase().includes(keyword)));
          const otherLinks = internalLinks.filter(link => !contactKeywords.some(keyword => link.toLowerCase().includes(keyword)));


          const linksToQueue = [...priorityLinks, ...otherLinks];


          for (const link of linksToQueue) {
            if (visited.size >= CONFIG.maxPagesToVisit) break;
            if (!visited.has(link)) {
              visited.add(link);
              if (priorityLinks.includes(link)) {
                queue.unshift(link); // Add priority links to the front
              } else {
                queue.push(link);
              }
            }
          }
          success = true;
          break;
        } catch (err) {
          const isRetryableError = err.name === 'TimeoutError' || 
            err.message.includes('net::ERR_CONNECTION_TIMED_OUT') || 
            err.message.includes('net::ERR_NAME_NOT_RESOLVED') || 
            err.message.includes('net::ERR_CONNECTION_REFUSED') ||
            err.message.includes('net::ERR_CERT_DATE_INVALID') ||
            err.message.includes('net::ERR_CERT_AUTHORITY_INVALID') ||
            err.message.includes('SSL') ||
            err.message.includes('CERT');
          if (!isRetryableError) {
            console.log(`Attempt ${i + 1} failed for ${currentUrl}: ${err.message}`);
          }
          if (i === 4 && !isRetryableError) {
            console.log(`Failed to visit ${currentUrl} after 5 attempts.`);
          }
        }
      }
    }
  } catch (error) {
    if (error.name === 'TimeoutError' || 
        error.message.includes('net::ERR_CONNECTION_TIMED_OUT') || 
        error.message.includes('net::ERR_NAME_NOT_RESOLVED') ||
        error.message.includes('net::ERR_CERT_DATE_INVALID') ||
        error.message.includes('net::ERR_CERT_AUTHORITY_INVALID') ||
        error.message.includes('SSL') ||
        error.message.includes('CERT')) {
      // Silently ignore retryable errors on initial URL load
    } else {
      console.error(`An error occurred while extracting emails from ${url}:`, error);
    }
  }

//   // --- NEW SCRAPING LOGIC FOR PEOPLE DATA GOES HERE ---
  console.log(`[INFO] Starting enhanced scraping for people data on ${initialHost}...`);

  const peoplePageKeywords = ['team', 'about', 'leadership', 'our-people', 'management', 'executives', 'board', 'staff', 'people', 'contact', 'who-we-are', 'our-team', 'meet-the-team', 'leadership-team', 'executive-team', 'management-team', 'our-leadership', 'company', 'organization', 'personnel', 'employees', 'directory', 'roster'];
  const potentialPeoplePages = new Set();

  // First, try to find direct links to people pages from the initial crawl
  for (const link of visited) {
    if (peoplePageKeywords.some(keyword => link.toLowerCase().includes(keyword))) {
      potentialPeoplePages.add(link);
    }
  }

  // If no direct links, try constructing common people page URLs
  if (potentialPeoplePages.size === 0) {
    for (const keyword of peoplePageKeywords) {
      potentialPeoplePages.add(`https://${initialHost}/${keyword}`);
      potentialPeoplePages.add(`https://${initialHost}/${keyword}/`);
      potentialPeoplePages.add(`https://www.${initialHost}/${keyword}`);
      potentialPeoplePages.add(`https://www.${initialHost}/${keyword}/`);
    }
  }
    
// Function to validate if a string is a plausible name

  
function isValidName(name, title, irrelevantPhrases) {
  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return false;
  }

  const lowerName = name.toLowerCase();
  const lowerTitle = title ? title.toLowerCase() : '';

  // Check against irrelevant phrases
  if (irrelevantPhrases.some(phrase => lowerName.includes(phrase.toLowerCase()) || lowerTitle.includes(phrase.toLowerCase()))) {
    return false;
  }

  // Check for presence of numbers or too many special characters in the name
  if (/\d/.test(name) || (name.match(/[^a-zA-Z\s'-]/g) || []).length > 2) {
    return false;
  }

  // A name should typically have at least two words (first and last name) or be a single, longer word.
  const words = name.split(/\s+/).filter(Boolean);
  if (words.length === 1 && words[0].length < 3) { // e.g., "Dr." or "Mr." alone
    return false;
  }

  return true;
}
  
  // Function to scrape names, titles, and emails from a given page
  async function scrapePeopleFromPage(pageUrl, pageInstance) {
    const peopleFound = [];
    const maxRetries = 3;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await pageInstance.goto(pageUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
        const content = await pageInstance.content();

        // More aggressive approach: look for common HTML structures and patterns
        const scrapedElements = await pageInstance.$$eval('body p, body div, body span, body li, body td, body h1, body h2, body h3, body h4, body h5, body h6, body a, body strong, body b, body em, body i, body blockquote, body cite, body q, body address, body pre, body code, body samp, body kbd, body var, body dfn, body abbr, body acronym', (elements, irrelevantPhrases) => {
          const results = [];
          const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;

          // Define isValidNameInBrowser locally for the browser context
          const isValidNameInBrowser = (name, title, irrelevantPhrases) => {
            if (!name || typeof name !== 'string' || name.trim().length < 2) {
              return false;
            }

            const lowerName = name.toLowerCase();
            const lowerTitle = title ? title.toLowerCase() : '';

            // Check against irrelevant phrases
            if (irrelevantPhrases.some(phrase => lowerName.includes(phrase.toLowerCase()) || lowerTitle.includes(phrase.toLowerCase()))) {
              return false;
            }

            // Check for presence of numbers or too many special characters in the name
            if (/\d/.test(name) || (name.match(/[^a-zA-Z\s'-]/g) || []).length > 2) {
              return false;
            }

            // A name should typically have at least two words (first and last name) or be a single, longer word.
            const words = name.split(/\s+/).filter(Boolean);
            if (words.length === 1 && words[0].length < 3) { // e.g., "Dr." or "Mr." alone
              return false;
            }

            return true;
          };

          elements.forEach(el => {
            if (el.innerText && el.innerText.length > 5 && el.innerText.length < 500) {
              const text = el.innerText.trim();
              const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);

              let name = '';
              let title = '';
              let email = '';

              // Find email in the text
              const emailMatch = text.match(emailRegex);
              if (emailMatch) {
                email = emailMatch[0];

                // Try different patterns to extract name and title
                if (lines.length >= 2) {
                  // Multi-line: assume first is name, second is title
                  if (lines[0] && !emailRegex.test(lines[0])) name = lines[0];
                  if (lines[1] && !emailRegex.test(lines[1])) title = lines[1];
                } else if (lines.length === 1) {
                  // Single line: extract name from the line excluding email
                  name = lines[0].replace(emailRegex, '').replace(/[<>\(\)\-]/g, '').trim();
                }

                // Clean up name and title
                if (name && !/^[a-zA-Z\s.'-]+$/.test(name)) name = '';
                if (title && !/^[a-zA-Z\s.'-]+$/.test(title)) title = '';

                // Additional patterns for name-email combinations
                const patterns = [
                  /([A-Za-z\s]+)\s*<[^>]*>/g, // Name <...>
                  /\([^)]+\)\s*([A-Za-z\s]+)/g, // (...) Name
                  /([A-Za-z\s]+)\s*-\s*[^@]+@/g, // Name - ...@
                ];
                patterns.forEach(pattern => {
                  const match = text.match(pattern);
                  if (match) {
                    const extracted = match[0].replace(emailRegex, '').replace(/[<>\(\)\-]/g, '').trim();
                    if (extracted && !name) name = extracted;
                  }
                });

                // Validate and add
                if (isValidNameInBrowser(name, title, irrelevantPhrases)) {
                  results.push({ name, title, email });
                }
              }
            }
          });

          // Additional global search for specific patterns across the page
          const bodyText = document.body.innerText;
          const globalPatterns = [
            /([A-Za-z\s]+)\s*<([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})>/g, // Name <email>
            /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})\s*\(([^)]+)\)/g, // email (name)
            /([A-Za-z\s]+)\s*-\s*([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g, // Name - email
          ];
          globalPatterns.forEach(pattern => {
            let match;
            while ((match = pattern.exec(bodyText)) !== null) {
              const name = match[1] || match[2];
              const email = match[2] || match[1];
              if (name && email && isValidNameInBrowser(name, '', irrelevantPhrases)) {
                results.push({ name, title: '', email });
              }
            }
          });

          return results;
        }, CONFIG.irrelevantNamePhrases);

        scrapedElements.forEach(person => {
          if (person.name && person.email) {
            peopleFound.push(person);
          }
        });
        return peopleFound; // Success, return the results
      } catch (error) {
        console.error(`Error scraping people from ${pageUrl} (attempt ${attempt}/${maxRetries}):`, error.message);
        if (attempt === maxRetries) {
          return []; // Return empty array after all retries
        }
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }
  }

  // Visit potential people pages and scrape
  for (const peoplePageUrl of potentialPeoplePages) {
    if (scrapedPeople.length >= CONFIG.maxPeopleToScrape) {
      console.log(`Reached max people to scrape (${CONFIG.maxPeopleToScrape}). Stopping.`);
      break;
    }
    if (!visited.has(peoplePageUrl)) { // Avoid re-visiting pages already crawled for general emails
      console.log(`[INFO] Visiting potential people page: ${peoplePageUrl}`);
      const peopleOnPage = await scrapePeopleFromPage(peoplePageUrl, page);
      peopleOnPage.forEach(person => {
        if (scrapedPeople.length < CONFIG.maxPeopleToScrape) {
          scrapedPeople.push(person);
          scrapedEmails.add(person.email); // Add people's emails to the general scrapedEmails set
        }
      });
    }
  }

  // Apply "Least Position" Logic to Scraped Data
  if (scrapedPeople.length > 0) {
    // Sort people by job title score in ascending order (least position first)
    scrapedPeople.sort((a, b) => getJobTitleScore(a.title) - getJobTitleScore(b.title));

    // Select the person with the least position as the sender
    sender = {
      first_name: scrapedPeople[0].name.split(' ')[0] || 'Team',
      last_name: scrapedPeople[0].name.split(' ').slice(1).join(' ') || 'Member',
      email: scrapedPeople[0].email,
      title: scrapedPeople[0].title
    };
    console.log(`[INFO] Selected sender: ${sender.first_name} ${sender.last_name} (${sender.title}) - ${sender.email}`);
  } else {
    // Fallback: if no specific people were scraped, set sender to null
    sender = null;
    console.log(`[INFO] No specific people scraped. Setting sender to null.`);
  }

  return { emails: Array.from(scrapedEmails), domain: initialHost, companyName, scrapedPeople, sender };
 
  // Add this line at the very end of the function
  if (page && !page.isClosed()) {
    await page.close();

}

}



// ---------- MAIN BOT ----------
async function main(io) {
  if (!emailQueueProcessorInterval) {
    emailQueueProcessorInterval = setInterval(emailQueueProcessor, 2 * 60 * 1000); // Run every 2 minutes
  }

  let browser = await puppeteer.launch({
    headless: "new",
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu',
      // '--ignore-certificate-errors',
      // '--ignore-ssl-errors',
      // '--ignore-certificate-errors-spki-list',
      // '--ignore-ssl-errors-ignore-untrusted'
    ],
  });

  // Start email queue processor
  emailQueueProcessor(); // Run once immediately
  setInterval(emailQueueProcessor, 300000); // Then every 5 minutes
  console.log('[INFO] Email queue processor started, running every 5 minutes.');

  while (true) {
    try {
      const leads = loadLeads();
      console.log(`Loaded ${leads.length} existing leads.`); // Added log
      const shuffledIndustries = shuffleArray([...CONFIG.industries]);

      for (const industry of shuffledIndustries) {
        console.log(`\nSearching websites for industry: ${industry}`);

        const websites = await getWebsitesByIndustry(industry, browser);
        console.log(`Found ${websites.length} websites for industry ${industry}.`); // Added log

        for (const website of websites) {
          if (leads.some(l => l.website === website)) {
            console.log(`Skipping already processed website: ${website}`);
            continue;
          }

          const { emails, domain, companyName, scrapedPeople, sender } = await extractEmailsFromWebsite(website, browser);
          // A lead is valid if we found any emails (scraped or Apollo) or Apollo contacts
          if (emails.length > 0 || scrapedPeople.length > 0) {
            const lead = {
              website,
              domain, // Store the extracted domain
              companyName, // Store the extracted company name
              emails, // Emails found via scraping and Apollo (excluding sender)
              scrapedPeople, // All relevant Apollo contacts
              sender, // The selected sender contact from Apollo
              industry,
              timestamp: new Date().toISOString(),
              emailsSent: false,
              sentEmailLinks: [],
            };
            leads.push(lead);
            saveLeads(leads);
            console.log(`Saved new lead for ${website}. Total leads: ${leads.length}`); // Added log
            io.emit('new-lead', lead);
          } else {
            console.log(`No emails found for ${website}.`); // Added log
        } // Closing brace for 'for (const website of websites)' loop
      } // <--- ADDED: Closing brace for 'for (const industry of shuffledIndustries)' loop

      console.log('\nFinished scraping all industries. Restarting in a bit...');
      if (io) { // Only emit if io is defined
        io.emit('bot-status', { message: 'Finished scraping all industries. Restarting in a bit...' });
      }
      await wait(10000);
     } // Wait for 10 seconds before the next big loop
    } catch (error) {
      console.error('A critical error occurred in the main loop:', error);
      if (io) { // Only emit if io is defined
        io.emit('bot-error', { message: error.message });
      }
      if (browser) await browser.close();
      console.log('Restarting browser and continuing...');
      browser = await puppeteer.launch({
        headless: "new", // Changed to "new" as per deprecation warning
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--disable-gpu',
          // '--ignore-certificate-errors',
          // '--ignore-ssl-errors',
          // '--ignore-certificate-errors-spki-list',
          // '--ignore-ssl-errors-ignore-untrusted'
        ],
      });
    }
  }
  }

module.exports = { main };

if (require.main === module) {
  main();
}