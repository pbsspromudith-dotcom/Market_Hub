"use client";


import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Link from 'next/link';
import { formatPrice } from '../constants';
import { useUI } from '../components/UIProvider';
import PromotionsAdmin from '@/components/admin/PromotionsAdmin';

const AdminDashboard: React.FC = () => {
  const [adminStats, setAdminStats] = useState<any>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [options, setOptions] = useState<any[]>([]);
  const [newOptionType, setNewOptionType] = useState('category');
  const [newOptionValue, setNewOptionValue] = useState('');
  const [newOptionParentId, setNewOptionParentId] = useState('');
  const [isCreatingOption, setIsCreatingOption] = useState(false);
  const [isDeletingOption, setIsDeletingOption] = useState<number | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [isDeletingUser, setIsDeletingUser] = useState<number | null>(null);
  const [editingUser, setEditingUser] = useState<any>(null);

  // Sub Master specific states
  const [activeSubMaster, setActiveSubMaster] = useState('category');
  const [subMasterSearch, setSubMasterSearch] = useState('');
  const [isAddingOption, setIsAddingOption] = useState(false);

  const subMasterTypes = [
    { id: 'category', label: 'Categories', icon: 'category' },
    { id: 'car_make', label: 'Car Makes', icon: 'directions_car' },
    { id: 'car_model', label: 'Car Models', icon: 'commute' },
    { id: 'car_type', label: 'Car Types', icon: 'local_taxi' },
    { id: 'vehicle_type', label: 'Vehicle Types', icon: 'two_wheeler' },
    { id: 'fuel_type', label: 'Fuel Types', icon: 'local_gas_station' },
    { id: 'drivetrain', label: 'Drivetrains', icon: 'settings' },
    { id: 'price_option', label: 'Price Options', icon: 'payments' }
  ];

  // Email Config State
  const [emailConfig, setEmailConfig] = useState({
    smtp_host: 'smtp.gmail.com',
    smtp_port: '587',
    smtp_username: '',
    smtp_password: '',
    smtp_from_email: '',
    smtp_from_name: 'HitAds.ca',
    smtp_encryption: 'tls',
  });
  const [isSavingEmail, setIsSavingEmail] = useState(false);
  const [emailSaveMsg, setEmailSaveMsg] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [testEmail, setTestEmail] = useState('');
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [showSmtpPassword, setShowSmtpPassword] = useState(false);

  // Social Profiles Tab State
  const [isSavingSocial, setIsSavingSocial] = useState(false);
  const [socialSaveMsg, setSocialSaveMsg] = useState<{type: 'success' | 'error', text: string} | null>(null);

  // Tab Navigation State
  const [activeTab, setActiveTab] = useState('overview');

  // ── Ad Templates Tab State ──
  const [tplCategories, setTplCategories] = useState<any[]>([]);
  const [tplMainCatId, setTplMainCatId] = useState<number | null>(null);
  const [tplSubCatId, setTplSubCatId] = useState<number | null>(null);
  const [tplL3CatId, setTplL3CatId] = useState<number | null>(null);
  const [tplConfig, setTplConfig] = useState<any>({});
  const [tplInheritedFrom, setTplInheritedFrom] = useState<string | null>(null);
  const [tplIsOwn, setTplIsOwn] = useState(false);
  const [tplAttributes, setTplAttributes] = useState<any[]>([]);
  const [tplSaving, setTplSaving] = useState(false);
  const [tplMsg, setTplMsg] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [tplNewAttrName, setTplNewAttrName] = useState('');
  const [tplNewAttrType, setTplNewAttrType] = useState('Text');
  const [tplNewAttrRequired, setTplNewAttrRequired] = useState(false);
  const [tplNewAttrOptions, setTplNewAttrOptions] = useState('');
  const [tplAddingAttr, setTplAddingAttr] = useState(false);
  const [tplDeletingAttr, setTplDeletingAttr] = useState<number | null>(null);
  const { showAlert, showConfirm } = useUI();

  // ── Approval Workflow State ──
  const [approvalStages, setApprovalStages] = useState<any[]>([]);
  const [approvalTemplates, setApprovalTemplates] = useState<any[]>([]);
  const [pendingApprovals, setPendingApprovals] = useState<any[]>([]);
  const [approvalSubTab, setApprovalSubTab] = useState<'stages' | 'templates' | 'pending'>('pending');
  // Stage form
  const [stageFormName, setStageFormName] = useState('');
  const [stageFormDesc, setStageFormDesc] = useState('');
  const [stageFormOrder, setStageFormOrder] = useState(0);
  const [stageFormEditId, setStageFormEditId] = useState<number | null>(null);
  const [isSavingStage, setIsSavingStage] = useState(false);
  // Template form
  const [tplFormName, setTplFormName] = useState('');
  const [tplFormDesc, setTplFormDesc] = useState('');
  const [tplFormIsDefault, setTplFormIsDefault] = useState(false);
  const [tplFormCategoryId, setTplFormCategoryId] = useState<number | null>(null);
  const [tplFormStageIds, setTplFormStageIds] = useState<number[]>([]);
  const [tplFormEditId, setTplFormEditId] = useState<number | null>(null);
  const [isSavingTemplate, setIsSavingTemplate] = useState(false);
  // Approve/reject
  const [isProcessingApproval, setIsProcessingApproval] = useState<number | null>(null);
  const [rejectNoteId, setRejectNoteId] = useState<number | null>(null);
  const [rejectNote, setRejectNote] = useState('');
  const [approvalMsg, setApprovalMsg] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const DEFAULT_TEMPLATE: any = {
    hideTitle: false, hideDescription: false, hideLocation: false,
    hidePrice: false, priceRequired: true, priceLabel: 'Price', pricePlaceholder: '0.00',
    hideCondition: false, hidePhotos: false, photosRequired: true,
    hidePhone: false, hideSocialLinks: false, hideCarFeatures: false, hideBrandModel: false
  };

  // Load categories tree for templates tab
  useEffect(() => {
    if (activeTab === 'templates' && tplCategories.length === 0) {
      fetch('/api/categories/read')
        .then(r => r.json())
        .then(r => { if (r.success) setTplCategories(r.data); })
        .catch(console.error);
    }
  }, [activeTab]);

  // Resolve template when category selection changes
  useEffect(() => {
    const selectedId = tplL3CatId || tplSubCatId || tplMainCatId;
    if (!selectedId) { setTplConfig({}); setTplInheritedFrom(null); setTplIsOwn(false); setTplAttributes([]); return; }

    // Build path from main -> sub -> L3
    const path: any[] = [];
    const mainCat = tplCategories.find((c: any) => c.CategoryID == tplMainCatId);
    if (mainCat) path.push(mainCat);
    if (tplSubCatId && mainCat?.children) {
      const subCat = mainCat.children.find((c: any) => c.CategoryID == tplSubCatId);
      if (subCat) path.push(subCat);
      if (tplL3CatId && subCat?.children) {
        const l3Cat = subCat.children.find((c: any) => c.CategoryID == tplL3CatId);
        if (l3Cat) path.push(l3Cat);
      }
    }

    // Resolve: walk up from leaf to find first template_config
    let resolved = null;
    let resolvedFrom: string | null = null;
    let isOwn = false;
    for (let i = path.length - 1; i >= 0; i--) {
      if (path[i].template_config) {
        let cfg: any = null;
        try {
          cfg = typeof path[i].template_config === 'string' ? JSON.parse(path[i].template_config) : path[i].template_config;
          if (typeof cfg === 'string') {
            try { cfg = JSON.parse(cfg); } catch {}
          }
        } catch {
          try {
            const unescaped = String(path[i].template_config).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
            cfg = JSON.parse(unescaped);
          } catch {
            cfg = null;
          }
        }
        if (cfg && typeof cfg === 'object') {
          resolved = cfg;
          if (i === path.length - 1) {
            isOwn = true;
            resolvedFrom = null;
          } else {
            isOwn = false;
            resolvedFrom = path[i].CategoryName;
          }
          break;
        }
      }
    }
    setTplConfig(resolved || {});
    setTplInheritedFrom(isOwn ? null : resolvedFrom);
    setTplIsOwn(isOwn || !resolvedFrom);

    // Load attributes for the selected category (direct attributes for template management)
    fetch(`/api/categories/attributes?category_id=${selectedId}&direct=1`)
      .then(r => r.json())
      .then(r => { if (r.success) setTplAttributes(r.data); })
      .catch(console.error);
  }, [tplMainCatId, tplSubCatId, tplL3CatId, tplCategories]);

  const handleTplSave = async () => {
    const selectedId = tplL3CatId || tplSubCatId || tplMainCatId;
    if (!selectedId) return;
    setTplSaving(true);
    setTplMsg(null);
    try {
      const res = await fetch('/api/categories/save_template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category_id: selectedId, template_config: tplConfig })
      });
      const data = await res.json();
      if (data.success) {
        setTplMsg({ type: 'success', text: 'Template saved successfully!' });
        showAlert('Template saved successfully!', 'success');
        setTplIsOwn(true);
        setTplInheritedFrom(null);
        // Update local tree
        const updateTree = (cats: any[]): any[] => cats.map(c => {
          if (c.CategoryID == selectedId) return { ...c, template_config: JSON.stringify(tplConfig) };
          if (c.children) return { ...c, children: updateTree(c.children) };
          return c;
        });
        setTplCategories(updateTree(tplCategories));
      } else {
        setTplMsg({ type: 'error', text: data.message || 'Failed to save template.' });
        showAlert(data.message || 'Failed to save template.', 'error');
      }
    } catch { 
      setTplMsg({ type: 'error', text: 'Network error.' });
      showAlert('Network error saving template.', 'error');
    }
    setTplSaving(false);
    setTimeout(() => setTplMsg(null), 4000);
  };

  const doTplReset = async () => {
    const selectedId = tplL3CatId || tplSubCatId || tplMainCatId;
    if (!selectedId) return;
    setTplSaving(true);
    try {
      const res = await fetch('/api/categories/save_template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category_id: selectedId, template_config: null })
      });
      const data = await res.json();
      if (data.success) {
        setTplMsg({ type: 'success', text: 'Template reset. Now inheriting from parent.' });
        showAlert('Template reset. Now inheriting from parent.', 'success');
        // Clear in local tree
        const updateTree = (cats: any[]): any[] => cats.map(c => {
          if (c.CategoryID == selectedId) return { ...c, template_config: null };
          if (c.children) return { ...c, children: updateTree(c.children) };
          return c;
        });
        setTplCategories(updateTree(tplCategories));
        // Re-trigger resolution
        setTplMainCatId(prev => prev);
      } else {
        showAlert(data.message || 'Failed to reset template.', 'error');
      }
    } catch { 
      setTplMsg({ type: 'error', text: 'Network error.' });
      showAlert('Network error resetting template.', 'error');
    }
    setTplSaving(false);
    setTimeout(() => setTplMsg(null), 4000);
  };

  const handleTplAddAttr = async () => {
    const selectedId = tplL3CatId || tplSubCatId || tplMainCatId;
    if (!selectedId || !tplNewAttrName.trim()) return;
    setTplAddingAttr(true);
    try {
      const opts = (tplNewAttrType === 'Dropdown' || tplNewAttrType === 'CheckboxGroup') ? tplNewAttrOptions.split(',').map(s => s.trim()).filter(Boolean) : [];
      const res = await fetch('/api/categories/add_attribute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category_id: selectedId,
          attribute_name: tplNewAttrName.trim(),
          attribute_type: tplNewAttrType,
          is_required: tplNewAttrRequired ? 1 : 0,
          options: opts
        })
      });
      const data = await res.json();
      if (data.success) {
        setTplNewAttrName(''); setTplNewAttrOptions(''); setTplNewAttrRequired(false);
        // Reload attributes
        const r2 = await fetch(`/api/categories/attributes?category_id=${selectedId}&direct=1`);
        const d2 = await r2.json();
        if (d2.success) setTplAttributes(d2.data);
        setTplMsg({ type: 'success', text: 'Attribute added!' });
        showAlert('Attribute added successfully!', 'success');
      } else {
        setTplMsg({ type: 'error', text: data.message || 'Failed to add attribute.' });
        showAlert(data.message || 'Failed to add attribute.', 'error');
      }
    } catch { 
      setTplMsg({ type: 'error', text: 'Network error.' });
      showAlert('Network error adding attribute.', 'error');
    }
    setTplAddingAttr(false);
    setTimeout(() => setTplMsg(null), 4000);
  };

  const doTplDeleteAttr = async (attrId: number) => {
    setTplDeletingAttr(attrId);
    try {
      const res = await fetch('/api/categories/delete_attribute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attribute_id: attrId })
      });
      const data = await res.json();
      if (data.success) {
        setTplAttributes(prev => prev.filter(a => a.AttributeID !== attrId));
        setTplMsg({ type: 'success', text: 'Attribute deleted!' });
        showAlert('Attribute deleted successfully!', 'success');
      } else {
        showAlert(data.message || 'Failed to delete attribute.', 'error');
      }
    } catch { 
      setTplMsg({ type: 'error', text: 'Network error.' });
      showAlert('Network error deleting attribute.', 'error');
    }
    setTplDeletingAttr(null);
    setTimeout(() => setTplMsg(null), 4000);
  };

  const getSelectedCatName = () => {
    const mainCat = tplCategories.find((c: any) => c.CategoryID == tplMainCatId);
    if (!mainCat) return '';
    let name = mainCat.CategoryName;
    if (tplSubCatId) {
      const sub = mainCat.children?.find((c: any) => c.CategoryID == tplSubCatId);
      if (sub) {
        name += ' > ' + sub.CategoryName;
        if (tplL3CatId) {
          const l3 = sub.children?.find((c: any) => c.CategoryID == tplL3CatId);
          if (l3) name += ' > ' + l3.CategoryName;
        }
      }
    }
    return name;
  };


  // Read user role from localStorage to filter tabs
  const [userRole, setUserRole] = useState('admin');
  const [userName, setUserName] = useState('Admin');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        if (user.role) setUserRole(String(user.role).trim().toLowerCase());
        if (user.name) setUserName(user.name);
      }
    } catch {}
  }, []);

  const allTabs = [
    { id: 'overview', label: 'Overview', icon: 'dashboard' },
    { id: 'listings', label: 'Listings', icon: 'inventory_2' },
    { id: 'approvals', label: 'Approvals', icon: 'verified' },
    { id: 'users', label: 'Users', icon: 'people' },
    { id: 'menu', label: 'Menu Layout', icon: 'menu_open' },
    { id: 'templates', label: 'Ad Templates', icon: 'tune' },
    { id: 'lookups', label: 'Sub Masters', icon: 'category' },
    { id: 'listing-seo', label: 'Listing SEO', icon: 'travel_explore' },
    { id: 'email', label: 'Email Setup', icon: 'email' },
    { id: 'promotions', label: 'Promotions Pricing', icon: 'sell' },
    { id: 'seo', label: 'SEO Settings', icon: 'manage_search' },
    { id: 'social', label: 'Homepage & Footer', icon: 'home' }
  ];

  // SEO users only see these tabs
  const SEO_ALLOWED_TABS = ['listing-seo', 'seo', 'social'];
  const tabs = userRole === 'seo'
    ? allTabs.filter(t => SEO_ALLOWED_TABS.includes(t.id))
    : allTabs;

  // Category menu layout states
  const [menuCategories, setMenuCategories] = useState<any[]>([]);
  const [isAddingSubcat, setIsAddingSubcat] = useState<number | null>(null);
  const [newSubcatName, setNewSubcatName] = useState('');
  const [newRootCatName, setNewRootCatName] = useState('');
  const [newRootCatIcon, setNewRootCatIcon] = useState('category');
  const [isSavingCat, setIsSavingCat] = useState(false);
  const [isDeletingCat, setIsDeletingCat] = useState<number | null>(null);
  const [catMsg, setCatMsg] = useState<{type: 'success' | 'error', text: string} | null>(null);

  // SEO Settings State
  const [seoSettings, setSeoSettings] = useState<any>({
    gtm_id: '',
    ga4_id: '',
    meta_pixel_id: '',
    google_ads_id: '',
    google_site_verification: '',
    robots_txt: '',
    homepage_schema_markup: '',
    page_title_home: '',
    meta_desc_home: '',
    page_title_search: '',
    meta_desc_search: '',
    'page_title_toronto-classifieds': '',
    'meta_desc_toronto-classifieds': '',
    'page_title_buy-and-sell-toronto': '',
    'meta_desc_buy-and-sell-toronto': '',
    'page_title_local-services-toronto': '',
    'meta_desc_local-services-toronto': '',
    'page_title_jobs-toronto': '',
    'meta_desc_jobs-toronto': '',
    'page_title_real-estate-toronto': '',
    'meta_desc_real-estate-toronto': '',
    'page_title_sri-lankan-marketplace-canada': '',
    'meta_desc_sri-lankan-marketplace-canada': '',
    page_title_contact: '',
    meta_desc_contact: '',
    page_title_help: '',
    meta_desc_help: '',
    page_title_terms: '',
    meta_desc_terms: '',
    'page_title_buying-guides': '',
    'meta_desc_buying-guides': '',
    'page_title_safety-tips': '',
    'meta_desc_safety-tips': '',
    'page_title_selling-advice': '',
    'meta_desc_selling-advice': '',
    'page_title_market-trends': '',
    'meta_desc_market-trends': ''
  });
  const [isSavingSeo, setIsSavingSeo] = useState(false);
  const [seoSaveMsg, setSeoSaveMsg] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [activeSeoSubTab, setActiveSeoSubTab] = useState('general');

  // Listing SEO Management States
  const [seoListings, setSeoListings] = useState<any[]>([]);
  const [seoTotal, setSeoTotal] = useState(0);
  const [seoPage, setSeoPage] = useState(1);
  const [seoSearch, setSeoSearch] = useState('');
  const [seoCategoryFilter, setSeoCategoryFilter] = useState('');
  const [seoStatusFilter, setSeoStatusFilter] = useState('');
  const [seoCategories, setSeoCategories] = useState<string[]>([]);
  const [seoLoading, setSeoLoading] = useState(false);
  const [editingSeoListing, setEditingSeoListing] = useState<any>(null);
  const [seoForm, setSeoForm] = useState({ meta_title: '', meta_desc: '', keywords: '', focus_keyword: '', image_alt_text: '' });
  const [isSavingListingSeo, setIsSavingListingSeo] = useState(false);
  const [isGeneratingSeo, setIsGeneratingSeo] = useState(false);
  const [isBatchProcessingSeo, setIsBatchProcessingSeo] = useState(false);
  const [batchProgress, setBatchProgress] = useState({ current: 0, total: 0 });
  const [listingSeoMsg, setListingSeoMsg] = useState<{type: 'success' | 'error', text: string} | null>(null);

  useEffect(() => {
    // Set the initial active tab based on role
    if (userRole === 'seo') {
      setActiveTab('listing-seo');
    }

    // Only fetch admin-only data for admin users
    if (userRole !== 'seo') {
      fetch('/api/admin/stats')
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setAdminStats(data.stats);
          }
        })
        .catch(console.error);

      fetchListings();
      fetchOptions();
      fetchEmailConfig();
      fetchUsers();
      fetchMenuCategories();
    }

    // SEO settings are needed by both roles
    fetchSeoSettings();
  }, []);

  useEffect(() => {
    if (activeTab === 'listing-seo') {
      fetchListingSeo(1);
    }
  }, [activeTab]);

  const fetchSeoSettings = () => {
    fetch('/api/admin/seo_read?t=' + new Date().getTime())
      .then(res => res.json())
      .then(data => {
        if (data.success && data.settings) {
          setSeoSettings((prev: any) => ({ ...prev, ...data.settings }));
        }
      })
      .catch(console.error);
  };

  const handleSaveSeoSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSeo(true);
    setSeoSaveMsg(null);
    try {
      const response = await fetch('/api/admin/seo_update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(seoSettings),
      });
      const data = await response.json();
      if (data.success) {
        setSeoSaveMsg({ type: 'success', text: data.message });
      } else {
        setSeoSaveMsg({ type: 'error', text: data.message || 'Failed to save settings' });
      }
    } catch (err) {
      setSeoSaveMsg({ type: 'error', text: 'Network error. Backend not reachable.' });
    } finally {
      setIsSavingSeo(false);
      setTimeout(() => setSeoSaveMsg(null), 5000);
    }
  };

  const handleSaveSocialProfiles = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSocial(true);
    setSocialSaveMsg(null);
    try {
      const response = await fetch('/api/admin/seo_update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          social_facebook: seoSettings.social_facebook,
          social_x: seoSettings.social_x,
          social_instagram: seoSettings.social_instagram,
          footer_copyright_text: seoSettings.footer_copyright_text,
          homepage_hero_title_1: seoSettings.homepage_hero_title_1,
          homepage_hero_title_2: seoSettings.homepage_hero_title_2,
          homepage_hero_tag_1: seoSettings.homepage_hero_tag_1,
          homepage_hero_tag_2: seoSettings.homepage_hero_tag_2,
          homepage_hero_tag_3: seoSettings.homepage_hero_tag_3,
          homepage_hero_tag_4: seoSettings.homepage_hero_tag_4,
          homepage_ad_count: seoSettings.homepage_ad_count,
          listing_map_width: seoSettings.listing_map_width,
          listing_map_height: seoSettings.listing_map_height
        }),
      });
      const data = await response.json();
      if (data.success) {
        setSocialSaveMsg({ type: 'success', text: 'Social profiles saved successfully.' });
      } else {
        setSocialSaveMsg({ type: 'error', text: data.message || 'Failed to save profiles' });
      }
    } catch (err) {
      setSocialSaveMsg({ type: 'error', text: 'Network error. Backend not reachable.' });
    } finally {
      setIsSavingSocial(false);
      setTimeout(() => setSocialSaveMsg(null), 5000);
    }
  };

  const fetchMenuCategories = () => {
    fetch('/api/categories/read')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          setMenuCategories(data.data);
        }
      })
      .catch(console.error);
  };

  const handleCreateCategory = async (parentID: number | null, name: string, icon: string | null = null) => {
    if (!name.trim()) return;
    setIsSavingCat(true);
    setCatMsg(null);
    try {
      const response = await fetch('/api/categories/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ParentCategoryID: parentID,
          CategoryName: name.trim(),
          Icon: icon
        })
      });
      const data = await response.json();
      if (data.success) {
        setCatMsg({ type: 'success', text: data.message || 'Category created successfully.' });
        if (parentID === null) {
          setNewRootCatName('');
          setNewRootCatIcon('category');
        } else {
          setNewSubcatName('');
          setIsAddingSubcat(null);
        }
        fetchMenuCategories();
      } else {
        setCatMsg({ type: 'error', text: data.message || 'Failed to create category.' });
      }
    } catch (err) {
      setCatMsg({ type: 'error', text: 'Network error creating category.' });
    } finally {
      setIsSavingCat(false);
      setTimeout(() => setCatMsg(null), 5000);
    }
  };

  const handleDeleteCategory = (id: number) => {
    showConfirm({
      title: 'Delete Category',
      message: 'WARNING: Deleting this category will delete all its subcategories and listings. This action CANNOT be undone! Are you sure you want to proceed?',
      isDestructive: true,
      onConfirm: async () => {
        setIsDeletingCat(id);
        setCatMsg(null);
        try {
          const response = await fetch('/api/categories/delete', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ CategoryID: id })
          });
          const data = await response.json();
          if (data.success) {
            setCatMsg({ type: 'success', text: data.message || 'Category deleted successfully.' });
            fetchMenuCategories();
          } else {
            setCatMsg({ type: 'error', text: data.message || 'Failed to delete category.' });
          }
        } catch (err) {
          setCatMsg({ type: 'error', text: 'Network error deleting category.' });
        } finally {
          setIsDeletingCat(null);
          setTimeout(() => setCatMsg(null), 5000);
        }
      }
    });
  };

  const fetchListingSeo = (pageNum = 1) => {
    setSeoLoading(true);
    const params = new URLSearchParams({ all: '1', page: String(pageNum), limit: '50' });
    if (seoSearch) params.append('search', seoSearch);
    if (seoCategoryFilter) params.append('category', seoCategoryFilter);
    if (seoStatusFilter) params.append('seo_status', seoStatusFilter);
    fetch('/api/listings/seo_read?' + params.toString())
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setSeoListings(data.data || []);
          setSeoTotal(data.total || 0);
          setSeoPage(data.page || 1);
          if (data.categories) setSeoCategories(data.categories);
        }
      })
      .catch(console.error)
      .finally(() => setSeoLoading(false));
  };

  const handleSaveListingSeo = async () => {
    if (!editingSeoListing) return;
    setIsSavingListingSeo(true);
    setListingSeoMsg(null);
    try {
      const res = await fetch('/api/listings/seo_update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listing_id: editingSeoListing.id, ...seoForm }),
      });
      const data = await res.json();
      if (data.success) {
        setListingSeoMsg({ type: 'success', text: data.message || 'SEO data saved.' });
        fetchListingSeo(seoPage);
      } else {
        setListingSeoMsg({ type: 'error', text: data.message || 'Failed to save.' });
      }
    } catch {
      setListingSeoMsg({ type: 'error', text: 'Network error saving SEO data.' });
    } finally {
      setIsSavingListingSeo(false);
      setTimeout(() => setListingSeoMsg(null), 5000);
    }
  };

  const handleGenerateListingSeo = async (listingId: number) => {
    setIsGeneratingSeo(true);
    try {
      const res = await fetch('/api/listings/seo_generate?listing_id=' + listingId);
      const data = await res.json();
      if (data.success && data.generated) {
        setSeoForm({
          meta_title: data.generated.meta_title || '',
          meta_desc: data.generated.meta_desc || '',
          keywords: data.generated.keywords || '',
          focus_keyword: data.generated.focus_keyword || '',
          image_alt_text: data.generated.image_alt_text || '',
        });
      }
    } catch {
      setListingSeoMsg({ type: 'error', text: 'Failed to auto-generate SEO data.' });
    } finally {
      setIsGeneratingSeo(false);
    }
  };

  const handleBatchProcessSeo = async () => {
    if (seoListings.length === 0) return;
    setIsBatchProcessingSeo(true);
    setListingSeoMsg(null);
    const totalItems = seoListings.length;
    setBatchProgress({ current: 0, total: totalItems });

    let processedCount = 0;
    const batchSize = 5; // Chunked parallel batching

    try {
      for (let i = 0; i < seoListings.length; i += batchSize) {
        const chunk = seoListings.slice(i, i + batchSize);
        await Promise.all(
          chunk.map(async (item: any) => {
            const genRes = await fetch(`/api/listings/seo_generate?listing_id=${item.id}`);
            const genData = await genRes.json();
            if (genData.success && genData.generated) {
              await fetch('/api/listings/seo_update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ listing_id: item.id, ...genData.generated }),
              });
            }
          })
        );
        processedCount += chunk.length;
        setBatchProgress({ current: Math.min(processedCount, totalItems), total: totalItems });
      }
      setListingSeoMsg({ type: 'success', text: `Batch processing complete! Successfully updated SEO metadata for ${totalItems} listings.` });
      fetchListingSeo(seoPage);
    } catch (err) {
      setListingSeoMsg({ type: 'error', text: 'Error encountered during batch processing.' });
    } finally {
      setIsBatchProcessingSeo(false);
      setTimeout(() => setListingSeoMsg(null), 6000);
    }
  };

  const handleResetListingSeo = (listingId: number) => {
    showConfirm({
      title: 'Reset SEO',
      message: "Reset this listing's SEO to auto-generation? Manual overrides will be removed.",
      isDestructive: true,
      onConfirm: async () => {
        try {
          const res = await fetch('/api/listings/seo_update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ listing_id: listingId, reset: true }),
          });
          const data = await res.json();
          if (data.success) {
            setListingSeoMsg({ type: 'success', text: 'Reset to auto-generation.' });
            setSeoForm({ meta_title: '', meta_desc: '', keywords: '', focus_keyword: '', image_alt_text: '' });
            fetchListingSeo(seoPage);
          }
        } catch {
          setListingSeoMsg({ type: 'error', text: 'Failed to reset.' });
        }
        setTimeout(() => setListingSeoMsg(null), 5000);
      }
    });
  };

  const openSeoEditor = (listing: any) => {
    setEditingSeoListing(listing);
    setSeoForm({
      meta_title: listing.meta_title || '',
      meta_desc: listing.meta_desc || '',
      keywords: listing.keywords || '',
      focus_keyword: listing.focus_keyword || '',
      image_alt_text: listing.image_alt_text || '',
    });
    setListingSeoMsg(null);
  };

  const fetchUsers = () => {
    fetch('/api/users/read')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          setUsers(data.data);
        }
      })
      .catch(console.error);
  };

  const handleDeleteUser = (id: number) => {
    showConfirm({
      title: 'Delete User',
      message: 'Are you sure you want to delete this user? This cannot be undone.',
      isDestructive: true,
      onConfirm: async () => {
        setIsDeletingUser(id);
        try {
          const response = await fetch('/api/users/delete', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
          });
          const data = await response.json();
          if (data.success) {
            setUsers(users.filter((u: any) => u.id !== id));
            showAlert('User deleted successfully.', 'success');
          } else {
            showAlert(data.message || 'Failed to delete user', 'error');
          }
        } catch (err) {
          console.error(err);
          showAlert('Error deleting user', 'error');
        } finally {
          setIsDeletingUser(null);
        }
      }
    });
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    try {
      const response = await fetch('/api/users/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingUser),
      });
      const data = await response.json();
      if (data.success) {
        setUsers(users.map((u: any) => u.id === editingUser.id ? data.user : u));
        setEditingUser(null);
        showAlert('User updated successfully', 'success');
      } else {
        showAlert(data.message || 'Failed to update user', 'error');
      }
    } catch (err) {
      console.error(err);
      showAlert('Error updating user', 'error');
    }
  };

  const fetchOptions = () => {
    fetch('/api/options/read')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          setOptions(data.data);
        }
      })
      .catch(console.error);
  };

  const fetchListings = () => {
    fetch('/api/listings/read?show_all=true')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setListings(data);
        }
      })
      .catch(console.error);
  };

  // ── Approval Workflow Functions ──
  const fetchApprovalStages = () => {
    fetch('/api/admin/approval-stages')
      .then(r => r.json())
      .then(r => { if (r.success) setApprovalStages(r.data || []); })
      .catch(console.error);
  };

  const fetchApprovalTemplates = () => {
    fetch('/api/admin/approval-templates')
      .then(r => r.json())
      .then(r => { if (r.success) setApprovalTemplates(r.data || []); })
      .catch(console.error);
  };

  const fetchPendingApprovals = () => {
    fetch('/api/admin/pending-approvals')
      .then(r => r.json())
      .then(r => { if (r.success) setPendingApprovals(r.data || []); })
      .catch(console.error);
  };

  useEffect(() => {
    if (activeTab === 'approvals') {
      fetchApprovalStages();
      fetchApprovalTemplates();
      fetchPendingApprovals();
    }
  }, [activeTab]);

  const handleSaveStage = async () => {
    if (!stageFormName.trim()) return;
    setIsSavingStage(true);
    try {
      const res = await fetch('/api/admin/approval-stages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: stageFormEditId,
          stage_name: stageFormName,
          description: stageFormDesc,
          stage_order: stageFormOrder,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setApprovalMsg({ type: 'success', text: stageFormEditId ? 'Stage updated!' : 'Stage created!' });
        setStageFormName(''); setStageFormDesc(''); setStageFormOrder(0); setStageFormEditId(null);
        fetchApprovalStages();
      } else {
        setApprovalMsg({ type: 'error', text: data.error || 'Failed' });
      }
    } catch { setApprovalMsg({ type: 'error', text: 'Network error' }); }
    setIsSavingStage(false);
    setTimeout(() => setApprovalMsg(null), 4000);
  };

  const handleDeleteStage = async (id: number) => {
    showConfirm({
      title: 'Delete Stage',
      message: 'Are you sure you want to delete this approval stage?',
      isDestructive: true,
      onConfirm: async () => {
        try {
          const res = await fetch('/api/admin/approval-stages/delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
          });
          const data = await res.json();
          if (data.success) {
            fetchApprovalStages();
            setApprovalMsg({ type: 'success', text: 'Stage deleted!' });
          } else {
            setApprovalMsg({ type: 'error', text: data.error || 'Cannot delete' });
          }
        } catch { setApprovalMsg({ type: 'error', text: 'Network error' }); }
        setTimeout(() => setApprovalMsg(null), 4000);
      }
    });
  };

  const handleSaveTemplate = async () => {
    if (!tplFormName.trim()) return;
    setIsSavingTemplate(true);
    try {
      const res = await fetch('/api/admin/approval-templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: tplFormEditId,
          template_name: tplFormName,
          description: tplFormDesc,
          is_default: tplFormIsDefault,
          category_id: tplFormCategoryId,
          stages: tplFormStageIds.map((sid, idx) => ({ stage_id: sid, stage_order: idx, is_required: true })),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setApprovalMsg({ type: 'success', text: tplFormEditId ? 'Template updated!' : 'Template created!' });
        setTplFormName(''); setTplFormDesc(''); setTplFormIsDefault(false); setTplFormCategoryId(null); setTplFormStageIds([]); setTplFormEditId(null);
        fetchApprovalTemplates();
      } else {
        setApprovalMsg({ type: 'error', text: data.error || 'Failed' });
      }
    } catch { setApprovalMsg({ type: 'error', text: 'Network error' }); }
    setIsSavingTemplate(false);
    setTimeout(() => setApprovalMsg(null), 4000);
  };

  const handleDeleteTemplate = async (id: number) => {
    showConfirm({
      title: 'Delete Template',
      message: 'Are you sure you want to delete this approval template?',
      isDestructive: true,
      onConfirm: async () => {
        try {
          const res = await fetch('/api/admin/approval-templates/delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
          });
          const data = await res.json();
          if (data.success) {
            fetchApprovalTemplates();
            setApprovalMsg({ type: 'success', text: 'Template deleted!' });
          } else {
            setApprovalMsg({ type: 'error', text: data.error || 'Cannot delete' });
          }
        } catch { setApprovalMsg({ type: 'error', text: 'Network error' }); }
        setTimeout(() => setApprovalMsg(null), 4000);
      }
    });
  };

  const handleApproveReject = async (approvalId: number, listingId: number, action: 'approve' | 'reject', note?: string) => {
    setIsProcessingApproval(approvalId);
    try {
      const userId = JSON.parse(localStorage.getItem('user') || '{}')?.id;
      const res = await fetch('/api/admin/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          approval_id: approvalId,
          listing_id: listingId,
          action,
          review_note: note || null,
          reviewed_by: userId || null,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setApprovalMsg({ type: 'success', text: data.message });
        fetchPendingApprovals();
        fetchListings();
        setRejectNoteId(null);
        setRejectNote('');
      } else {
        setApprovalMsg({ type: 'error', text: data.error || 'Failed' });
      }
    } catch { setApprovalMsg({ type: 'error', text: 'Network error' }); }
    setIsProcessingApproval(null);
    setTimeout(() => setApprovalMsg(null), 4000);
  };

  const handleDeleteListing = (id: string) => {
    showConfirm({
      title: 'Delete Listing',
      message: 'Are you sure you want to delete this listing?',
      isDestructive: true,
      onConfirm: async () => {
        setIsDeleting(id);
        try {
          const response = await fetch('/api/listings/delete', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
          });
          const data = await response.json();
          if (data.success) {
            setListings(listings.filter((l: any) => l.id !== id));
            setSelectedIds(prev => { const next = new Set(prev); next.delete(id); return next; });
            showAlert('Listing deleted successfully.', 'success');
          } else {
            showAlert(data.error || 'Failed to delete listing', 'error');
          }
        } catch (err) {
          console.error(err);
          showAlert('Error deleting listing', 'error');
        } finally {
          setIsDeleting(null);
        }
      }
    });
  };

  const handleBulkDelete = () => {
    if (selectedIds.size === 0) return;
    showConfirm({
      title: 'Bulk Delete Listings',
      message: `Delete ${selectedIds.size} selected listing${selectedIds.size > 1 ? 's' : ''}? This cannot be undone.`,
      isDestructive: true,
      onConfirm: async () => {
        setIsBulkDeleting(true);
        const ids = Array.from(selectedIds);
        let deletedCount = 0;
        for (const id of ids) {
          try {
            const res = await fetch('/api/listings/delete', {
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ id }),
            });
            const data = await res.json();
            if (data.success) deletedCount++;
          } catch {}
        }
        setListings(prev => prev.filter((l: any) => !selectedIds.has(String(l.id))));
        setSelectedIds(new Set());
        setIsBulkDeleting(false);
        if (deletedCount < ids.length) {
          showAlert(`${ids.length - deletedCount} listing(s) could not be deleted.`, 'error');
        } else {
          showAlert(`Successfully deleted ${deletedCount} listing(s).`, 'success');
        }
      }
    });
  };

  const handleTogglePromotion = async (listingId: number, field: string, currentValue: boolean) => {
    try {
      const res = await fetch('/api/admin/listings/update_promotion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listing_id: listingId,
          [field]: !currentValue,
          duration_days: 30
        })
      });
      const data = await res.json();
      if (data.success) {
        setListings((prev: any[]) => prev.map((l: any) => l.id === listingId ? { ...l, ...data.listing } : l));
        showAlert('Promotion status updated successfully', 'success');
      } else {
        showAlert(data.message || 'Failed to update promotion', 'error');
      }
    } catch (err: any) {
      showAlert('Error updating promotion: ' + err.message, 'error');
    }
  };

  const handleCreateOption = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOptionValue.trim()) return;
    setIsCreatingOption(true);
    try {
      const response = await fetch('/api/options/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          option_type: activeSubMaster, 
          option_value: newOptionValue.trim(),
          parent_id: activeSubMaster === 'car_model' ? newOptionParentId : null
        }),
      });
      const data = await response.json();
      if (data.success) {
        setNewOptionValue('');
        if (activeSubMaster !== 'car_model') {
           setNewOptionParentId('');
        }
        setIsAddingOption(false);
        fetchOptions();
        showAlert('Option created successfully.', 'success');
      } else {
        showAlert(data.error || 'Failed to create option', 'error');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsCreatingOption(false);
    }
  };

  const handleUpdateParentId = async (id: number, optionType: string, parentId: string) => {
    try {
      const response = await fetch('/api/options/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, option_type: optionType, parent_id: parentId }),
      });
      const data = await response.json();
      if (data.success) {
        fetchOptions();
        showAlert('Mapping updated successfully.', 'success');
      } else {
        showAlert(data.error || 'Failed to update mapping', 'error');
      }
    } catch (err) {
      console.error(err);
      showAlert('Error updating mapping', 'error');
    }
  };

  const handleDeleteOption = (id: number, optionType: string) => {
    showConfirm({
      title: 'Delete Option',
      message: 'Are you sure you want to delete this option?',
      isDestructive: true,
      onConfirm: async () => {
        setIsDeletingOption(id);
        try {
          const response = await fetch('/api/options/delete', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, option_type: optionType }),
          });
          const data = await response.json();
          if (data.success) {
            setOptions(options.filter((o: any) => o.id !== id));
            showAlert('Option deleted successfully.', 'success');
          } else {
            showAlert(data.error || 'Failed to delete option', 'error');
          }
        } catch (err) {
          console.error(err);
          showAlert('Error deleting option', 'error');
        } finally {
          setIsDeletingOption(null);
        }
      }
    });
  };

  const fetchEmailConfig = () => {
    fetch('/api/admin/email_config')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.settings) {
          setEmailConfig(prev => ({ ...prev, ...data.settings }));
        }
      })
      .catch(console.error);
  };

  const handleSaveEmailConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingEmail(true);
    setEmailSaveMsg(null);
    try {
      const response = await fetch('/api/admin/email_config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailConfig),
      });
      const data = await response.json();
      if (data.success) {
        setEmailSaveMsg({ type: 'success', text: data.message });
      } else {
        setEmailSaveMsg({ type: 'error', text: data.message || 'Failed to save settings' });
      }
    } catch (err) {
      setEmailSaveMsg({ type: 'error', text: 'Network error. Backend not reachable.' });
    } finally {
      setIsSavingEmail(false);
      setTimeout(() => setEmailSaveMsg(null), 5000);
    }
  };

  const handleSendTestEmail = async () => {
    if (!testEmail.trim()) return;
    setIsSendingTest(true);
    setEmailSaveMsg(null);
    try {
      const response = await fetch('/api/admin/email_config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ test_email: testEmail }),
      });
      const data = await response.json();
      setEmailSaveMsg({ type: data.success ? 'success' : 'error', text: data.message });
    } catch (err) {
      setEmailSaveMsg({ type: 'error', text: 'Network error sending test email.' });
    } finally {
      setIsSendingTest(false);
      setTimeout(() => setEmailSaveMsg(null), 8000);
    }
  };

  const chartData = (adminStats && Array.isArray(adminStats.listingTrends)) ? adminStats.listingTrends : [];

  const stats = adminStats ? [
    { label: 'Total Listings', value: adminStats.totalListings.toLocaleString(), change: adminStats.listingsChange || '0%', icon: 'inventory_2', color: 'blue' },
    { label: 'New Users Today', value: adminStats.newUsersToday.toLocaleString(), change: adminStats.newUsersTodayChange || '0%', icon: 'person_add', color: 'purple' },
    { label: 'Total Users', value: adminStats.totalUsers.toLocaleString(), change: adminStats.usersChange || '0%', icon: 'people', color: 'red' },
    { label: 'Total Listing Value', value: '$' + Number(adminStats.revenue).toLocaleString(), change: adminStats.revenueChange || '0%', icon: 'payments', color: 'green' },
  ] : [
    { label: 'Total Listings', value: '-', change: '0%', icon: 'inventory_2', color: 'blue' },
    { label: 'New Users Today', value: '-', change: '0%', icon: 'person_add', color: 'purple' },
    { label: 'Total Users', value: '-', change: '0%', icon: 'people', color: 'red' },
    { label: 'Total Listing Value', value: '-', change: '0%', icon: 'payments', color: 'green' },
  ];

  if (!mounted) return null;

  return (
    <div className="max-w-[1600px] mx-auto px-6 py-10">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black">{userRole === 'seo' ? 'SEO Dashboard' : 'Dashboard Overview'}</h1>
          <p className="text-slate-500 font-medium">{userRole === 'seo' ? 'Manage SEO settings, listing metadata, and homepage content.' : `Welcome back, ${userName}. Here's what's happening today.`}</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <span className="material-icons absolute left-4 top-2.5 text-slate-400">search</span>
            <input className="pl-12 pr-4 py-2.5 bg-white border-slate-200 rounded-xl w-72 text-sm" placeholder="Search orders, users..." />
          </div>
          <button className="w-11 h-11 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-primary transition-colors relative">
            <span className="material-icons">notifications</span>
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap gap-2 mb-8 bg-slate-100 p-1.5 rounded-2xl w-full border border-slate-200/60 animate-in fade-in duration-300">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-shrink-0 flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-white text-primary shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="material-icons text-sm">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* 1. Overview Tab */}
      {activeTab === 'overview' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {stats.map(stat => (
              <div key={stat.label} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-50 flex items-center justify-center text-${stat.color}-500`}>
                    <span className="material-icons text-2xl">{stat.icon}</span>
                  </div>
                  <span className={`text-[10px] font-black text-${stat.change.startsWith('+') ? 'green' : 'red'}-500 uppercase tracking-widest`}>
                    {stat.change}
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-2xl font-black text-slate-900">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center mb-10">
                <div>
                  <h2 className="text-xl font-black">Listing Trends</h2>
                  <p className="text-xs text-slate-400 uppercase font-bold tracking-widest">Volume of new listings over 30 days</p>
                </div>
                <select className="text-xs font-bold border-slate-200 rounded-lg px-4 py-2">
                  <option>Last 30 Days</option>
                  <option>Last 7 Days</option>
                </select>
              </div>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="value" fill="#f2b90d" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
              <h2 className="text-xl font-black mb-8">Recent Activity</h2>
              <div className="space-y-6">
                {adminStats?.recentActivity ? adminStats.recentActivity.map((activity: any, i: number) => (
                  <Link
                    key={activity.id || i} href={`/item/${activity.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex gap-4 group/item hover:bg-slate-50/60 p-2 -m-2 rounded-2xl transition-all"
                  >
                    <div className="w-10 h-10 rounded-xl bg-green-50 flex-shrink-0 flex items-center justify-center text-green-500 group-hover/item:bg-primary/10 group-hover/item:text-primary transition-all">
                      <span className="material-icons text-lg">inventory_2</span>
                    </div>
                    <div>
                      <p className="text-sm text-slate-700">
                        <span className="font-bold text-slate-900 group-hover/item:text-primary transition-colors">{activity.title}</span> was posted as a new listing.
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Recently</p>
                    </div>
                  </Link>
                )) : (
                  <p className="text-sm text-slate-400">Loading recent activity...</p>
                )}
              </div>
              <button
                onClick={() => { setActiveTab('listings'); window.scrollTo(0, 0); }}
                className="w-full mt-10 py-3 font-bold text-primary hover:bg-primary/5 rounded-xl border border-primary/20 hover:border-primary/40 transition-all uppercase tracking-widest text-xs"
              >
                View All Activity
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Listings Tab */}
      {activeTab === 'listings' && (
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <div>
              <h2 className="text-xl font-black">Manage Listings</h2>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Add, review, or remove active listings</p>
            </div>
            <Link href="/post-ad"
              className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-primary/20 flex items-center gap-2 text-sm"
            >
              <span className="material-icons text-sm">add</span>
              Add Listing
            </Link>
          </div>

          {/* Bulk Action Bar */}
          {selectedIds.size > 0 && (
            <div className="flex items-center justify-between bg-red-50 border border-red-200 rounded-2xl px-6 py-4 mb-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="material-icons text-red-500 text-sm">checklist</span>
                </div>
                <span className="text-sm font-black text-red-700">
                  {selectedIds.size} listing{selectedIds.size > 1 ? 's' : ''} selected
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedIds(new Set())}
                  className="text-xs font-bold text-slate-500 hover:text-slate-700 px-3 py-1.5 rounded-lg hover:bg-white transition-all"
                >
                  Clear Selection
                </button>
                <button
                  onClick={handleBulkDelete}
                  disabled={isBulkDeleting}
                  className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-red-200 disabled:opacity-60"
                >
                  {isBulkDeleting ? (
                    <span className="material-icons text-sm animate-spin">sync</span>
                  ) : (
                    <span className="material-icons text-sm">delete_sweep</span>
                  )}
                  {isBulkDeleting ? 'Deleting...' : `Delete ${selectedIds.size} Selected`}
                </button>
              </div>
            </div>
          )}

          <div className="overflow-x-auto w-full">
            <table className="w-full text-left min-w-[800px]">
              <thead className="bg-slate-50 border-y border-slate-100 uppercase text-[10px] font-black text-slate-400 tracking-widest">
                <tr>
                  <th className="px-6 py-4 rounded-l-xl w-10">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer"
                      checked={listings.length > 0 && selectedIds.size === listings.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedIds(new Set(listings.map((l: any) => String(l.id))));
                        } else {
                          setSelectedIds(new Set());
                        }
                      }}
                      title="Select All"
                    />
                  </th>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Promotions</th>
                  <th className="px-6 py-4 text-right rounded-r-xl">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm font-medium">
                {listings.map((l: any) => (
                  <tr
                    key={l.id}
                    className={`border-b border-slate-50 transition-colors ${
                      selectedIds.has(String(l.id))
                        ? 'bg-primary/5 hover:bg-primary/10'
                        : 'hover:bg-slate-50/50'
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="px-6 py-4 w-10">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer"
                        checked={selectedIds.has(String(l.id))}
                        onChange={(e) => {
                          const next = new Set(selectedIds);
                          if (e.target.checked) next.add(String(l.id));
                          else next.delete(String(l.id));
                          setSelectedIds(next);
                        }}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200">
                          {l.image ? (
                             <img src={l.image} className="w-full h-full object-cover" alt="" />
                          ) : (
                             <span className="w-full h-full flex items-center justify-center material-icons text-slate-400 text-sm">image</span>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 line-clamp-1">{l.title}</p>
                          <p className="text-xs text-slate-400">{l.location}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold">{formatPrice(l.price, l.price_type)}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] uppercase font-black tracking-widest">
                        {l.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {(l.status === 'pending_approval') ? (
                        <span className="flex items-center gap-1.5 text-amber-500 text-xs font-bold">
                          <span className="w-2 h-2 rounded-full bg-amber-500"></span> Pending
                        </span>
                      ) : l.status === 'rejected' ? (
                        <span className="flex items-center gap-1.5 text-red-500 text-xs font-bold" title={l.rejection_reason || ''}>
                          <span className="w-2 h-2 rounded-full bg-red-500"></span> Rejected
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-green-500 text-xs font-bold">
                          <span className="w-2 h-2 rounded-full bg-green-500"></span> Active
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <button
                          onClick={() => handleTogglePromotion(l.id, 'is_home_gallery', !!l.is_home_gallery)}
                          className={`px-2 py-1 rounded text-[10px] font-bold border transition-colors ${
                            l.is_home_gallery
                              ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                              : 'bg-slate-100 text-slate-400 border-slate-200 hover:border-blue-300 hover:text-blue-600'
                          }`}
                          title="Toggle Home Page Gallery Promotion"
                        >
                          Home Gallery
                        </button>
                        <button
                          onClick={() => handleTogglePromotion(l.id, 'is_top_ad', !!l.is_top_ad)}
                          className={`px-2 py-1 rounded text-[10px] font-bold border transition-colors ${
                            l.is_top_ad
                              ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                              : 'bg-slate-100 text-slate-400 border-slate-200 hover:border-amber-300 hover:text-amber-600'
                          }`}
                          title="Toggle Top Ad Promotion"
                        >
                          Top Ad
                        </button>
                        <button
                          onClick={() => handleTogglePromotion(l.id, 'is_featured', !!l.is_featured)}
                          className={`px-2 py-1 rounded text-[10px] font-bold border transition-colors ${
                            l.is_featured
                              ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                              : 'bg-slate-100 text-slate-400 border-slate-200 hover:border-purple-300 hover:text-purple-600'
                          }`}
                          title="Toggle Featured Ad Promotion"
                        >
                          Featured
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleDeleteListing(l.id)}
                        disabled={isDeleting === l.id}
                        className="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-colors disabled:opacity-50 inline-flex"
                        title="Delete Listing"
                      >
                        {isDeleting === l.id ? (
                          <span className="material-icons text-sm animate-spin">sync</span>
                        ) : (
                          <span className="material-icons text-sm">delete</span>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
                {listings.length === 0 && (
                  <tr>
                     <td colSpan={6} className="px-6 py-10 text-center text-slate-400">Loading listings...</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. Users Tab */}
      {activeTab === 'users' && (
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="mb-6">
            <h2 className="text-xl font-black">Manage Users</h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">View, edit, or remove user accounts</p>
          </div>

          <div className="overflow-x-auto w-full">
            <table className="w-full text-left min-w-[800px]">
              <thead className="bg-slate-50 border-y border-slate-100 uppercase text-[10px] font-black text-slate-400 tracking-widest">
                <tr>
                  <th className="px-6 py-4 rounded-l-xl">User</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Joined</th>
                  <th className="px-6 py-4 text-right rounded-r-xl">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm font-medium">
                {users.map((u: any) => (
                  <tr key={u.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black">
                          {u.avatar ? (
                            <img src={u.avatar} alt={u.name} className="w-full h-full object-cover rounded-full" />
                          ) : (
                            u.name.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{u.name}</p>
                          <p className="text-xs text-slate-400">{u.email}</p>
                          {u.phone && <p className="text-xs text-slate-400">{u.phone}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] uppercase font-black tracking-widest ${
                        u.role === 'admin' ? 'bg-purple-100 text-purple-600' : u.role === 'seo' ? 'bg-teal-100 text-teal-600' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-505 text-xs font-bold">
                      {new Date(u.join_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setEditingUser(u)}
                        className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-500 hover:text-white flex items-center justify-center transition-colors inline-flex mr-2"
                        title="Edit User"
                      >
                        <span className="material-icons text-sm">edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        disabled={isDeletingUser === u.id}
                        className="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-colors disabled:opacity-50 inline-flex"
                        title="Delete User"
                      >
                        {isDeletingUser === u.id ? (
                          <span className="material-icons text-sm animate-spin">sync</span>
                        ) : (
                          <span className="material-icons text-sm">delete</span>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-slate-400">Loading users...</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit User Modal (rendered as modal overlay, keep root level) */}
      {editingUser && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black">Edit User</h3>
              <button onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-slate-600">
                <span className="material-icons">close</span>
              </button>
            </div>
            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Name</label>
                <input
                  type="text"
                  required
                  value={editingUser.name}
                  onChange={e => setEditingUser({...editingUser, name: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border-slate-100 rounded-xl focus:ring-primary text-sm"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={editingUser.email}
                  onChange={e => setEditingUser({...editingUser, email: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-100 rounded-xl focus:ring-primary text-sm"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Phone</label>
                <input
                  type="text"
                  value={editingUser.phone || ''}
                  onChange={e => setEditingUser({...editingUser, phone: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border-slate-100 rounded-xl focus:ring-primary text-sm"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Role</label>
                <select
                  value={editingUser.role}
                  onChange={e => setEditingUser({...editingUser, role: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border-slate-100 rounded-xl focus:ring-primary text-sm"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="seo">SEO</option>
                </select>
              </div>
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl text-sm transition-colors shadow-lg shadow-primary/20"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Menu Layout Tab */}
      {activeTab === 'menu' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Left Panel: Add Root Category Form */}
          <div className="bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-200 shadow-sm h-fit">
            <h2 className="text-xl font-black mb-2 flex items-center gap-2">
              <span className="material-icons text-primary">add_circle</span>
              New Root Category
            </h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-6">
              Create a primary menu item
            </p>

            {catMsg && catMsg.type === 'success' && (
              <div className="mb-4 p-4 bg-green-50 border border-green-100 text-green-700 rounded-xl text-xs font-bold flex items-center gap-2">
                <span className="material-icons text-sm">check_circle</span>
                {catMsg.text}
              </div>
            )}
            {catMsg && catMsg.type === 'error' && (
              <div className="mb-4 p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl text-xs font-bold flex items-center gap-2">
                <span className="material-icons text-sm">error</span>
                {catMsg.text}
              </div>
            )}

            <form onSubmit={(e) => { e.preventDefault(); handleCreateCategory(null, newRootCatName, newRootCatIcon); }} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">
                  Category Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Electronics, Vehicles"
                  value={newRootCatName}
                  onChange={(e) => setNewRootCatName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-primary focus:border-primary text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">
                  Menu Icon (Material Icon Name)
                </label>
                <div className="relative">
                  <span className="material-icons absolute left-4 top-3 text-slate-400 text-lg">
                    {newRootCatIcon}
                  </span>
                  <select
                    value={newRootCatIcon}
                    onChange={(e) => setNewRootCatIcon(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-primary focus:border-primary text-sm font-medium"
                  >
                    <option value="category">Category (Default)</option>
                    <option value="directions_car">Car / Automotive</option>
                    <option value="home">Home / Real Estate</option>
                    <option value="work">Jobs / Careers</option>
                    <option value="shopping_bag">Shopping / Retail</option>
                    <option value="pets">Pets / Animals</option>
                    <option value="sports_esports">Games / Hobbies</option>
                    <option value="build">Services / Tools</option>
                    <option value="star">Star / Popular</option>
                    <option value="smartphone">Mobile / Gadgets</option>
                    <option value="chair">Furniture</option>
                    <option value="restaurant">Food / Dining</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSavingCat || !newRootCatName.trim()}
                className="w-full bg-primary hover:bg-primary-hover text-white font-black py-3.5 px-6 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50 text-xs uppercase tracking-widest mt-6"
              >
                {isSavingCat ? (
                  <span className="material-icons text-sm animate-spin">sync</span>
                ) : (
                  <span className="material-icons text-sm">save</span>
                )}
                Create Category
              </button>
            </form>
          </div>

          {/* Right Panel: Interactive Tree Viewer */}
          <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col min-w-0">
            <div className="mb-6 pb-4 border-b border-slate-100">
              <h2 className="text-xl font-black text-slate-800">Menu & Subcategory Structure</h2>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
                Manage nested categories and header navigation sub-menus.
              </p>
            </div>

            {/* Tree View */}
            <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
              {menuCategories.map((root) => (
                <div
                  key={root.CategoryID}
                  className="border border-slate-100 bg-slate-50/30 rounded-2xl p-4 shadow-sm transition-all hover:border-slate-200/80"
                >
                  {/* Root Category Row */}
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                        <span className="material-icons text-xl">{root.Icon || 'category'}</span>
                      </div>
                      <div>
                        <h3 className="font-extrabold text-sm text-slate-800">{root.CategoryName}</h3>
                        <p className="text-[10px] font-medium text-slate-400">/{root.Slug} • ID: #{root.CategoryID}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setIsAddingSubcat(root.CategoryID);
                          setNewSubcatName('');
                        }}
                        className="text-xs font-bold text-slate-600 hover:text-primary px-3 py-1.5 rounded-lg bg-white border border-slate-200 shadow-sm transition-all hover:bg-slate-50 flex items-center gap-1"
                        title="Add sub-category"
                      >
                        <span className="material-icons text-sm">add</span>
                        Add Sub
                      </button>

                      <button
                        onClick={() => handleDeleteCategory(root.CategoryID)}
                        disabled={isDeletingCat === root.CategoryID}
                        className="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-colors disabled:opacity-50"
                        title="Delete category and all children"
                      >
                        {isDeletingCat === root.CategoryID ? (
                          <span className="material-icons text-xs animate-spin">sync</span>
                        ) : (
                          <span className="material-icons text-sm">delete_outline</span>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Inline adding form for Root Sub-category */}
                  {isAddingSubcat === root.CategoryID && (
                    <div className="mt-3 ml-12 p-3 bg-white rounded-xl border border-slate-200 animate-in slide-in-from-top-2 duration-200">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">
                        Add Subcategory under {root.CategoryName}
                      </p>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          required
                          placeholder="e.g. Computers, Used Cars"
                          value={newSubcatName}
                          onChange={(e) => setNewSubcatName(e.target.value)}
                          className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-primary focus:border-primary text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => handleCreateCategory(root.CategoryID, newSubcatName)}
                          disabled={isSavingCat || !newSubcatName.trim()}
                          className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg font-bold text-xs transition-all shadow-md disabled:opacity-50"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsAddingSubcat(null);
                            setNewSubcatName('');
                          }}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-lg font-bold text-xs transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Level 2 Sub-categories */}
                  {root.children && root.children.length > 0 && (
                    <div className="mt-3 ml-10 pl-4 border-l-2 border-slate-200 space-y-3 pt-2">
                      {root.children.map((sub: any) => (
                        <div key={sub.CategoryID} className="group/sub">
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0"></span>
                              <div>
                                <span className="font-bold text-xs text-slate-700">{sub.CategoryName}</span>
                                <span className="text-[9px] text-slate-400 ml-2 font-medium">/{sub.Slug} • ID: #{sub.CategoryID}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 opacity-0 group-hover/sub:opacity-100 transition-opacity">
                              <button
                                onClick={() => {
                                  setIsAddingSubcat(sub.CategoryID);
                                  setNewSubcatName('');
                                }}
                                className="text-[10px] font-bold text-slate-500 hover:text-primary px-2 py-1 rounded bg-white border border-slate-200 transition-all"
                                title="Add sub-subcategory"
                              >
                                + Add Sub
                              </button>
                              <button
                                onClick={() => handleDeleteCategory(sub.CategoryID)}
                                disabled={isDeletingCat === sub.CategoryID}
                                className="w-6 h-6 rounded bg-red-50 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-colors disabled:opacity-50"
                                title="Delete subcategory"
                              >
                                <span className="material-icons text-[14px]">delete</span>
                              </button>
                            </div>
                          </div>

                          {/* Inline adding form for Sub-subcategory */}
                          {isAddingSubcat === sub.CategoryID && (
                            <div className="mt-2 ml-4 p-3 bg-white rounded-lg border border-slate-200 animate-in slide-in-from-top-2 duration-200">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">
                                Add Child under {sub.CategoryName}
                              </p>
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  required
                                  placeholder="e.g. Laptops, Sedans"
                                  value={newSubcatName}
                                  onChange={(e) => setNewSubcatName(e.target.value)}
                                  className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-primary focus:border-primary text-xs"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleCreateCategory(sub.CategoryID, newSubcatName)}
                                  disabled={isSavingCat || !newSubcatName.trim()}
                                  className="bg-primary hover:bg-primary-hover text-white px-3 py-1.5 rounded-lg font-bold text-xs transition-all shadow-md disabled:opacity-50"
                                >
                                  Save
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setIsAddingSubcat(null);
                                    setNewSubcatName('');
                                  }}
                                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1.5 rounded-lg font-bold text-xs transition-all"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Level 3 Sub-subcategories */}
                          {sub.children && sub.children.length > 0 && (
                            <div className="mt-2 ml-4 pl-4 border-l border-slate-100 space-y-2">
                              {sub.children.map((nested: any) => (
                                <div key={nested.CategoryID} className="flex items-center justify-between gap-4 group/nested">
                                  <div className="flex items-center gap-2">
                                    <span className="w-1 h-1 rounded-full bg-slate-300 shrink-0"></span>
                                    <div>
                                      <span className="text-xs text-slate-600 font-medium">{nested.CategoryName}</span>
                                      <span className="text-[8px] text-slate-400 ml-2">/{nested.Slug} • ID: #{nested.CategoryID}</span>
                                    </div>
                                  </div>

                                  <button
                                    onClick={() => handleDeleteCategory(nested.CategoryID)}
                                    disabled={isDeletingCat === nested.CategoryID}
                                    className="w-5 h-5 rounded bg-red-50 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-colors disabled:opacity-50 opacity-0 group-hover/nested:opacity-100"
                                    title="Delete sub-subcategory"
                                  >
                                    <span className="material-icons text-[12px]">delete</span>
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {menuCategories.length === 0 && (
                <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="material-icons text-4xl mb-2 opacity-50">category</span>
                  <p className="text-sm font-medium">No menu categories found. Create a root category to start.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4. Sub Masters Tab */}
      {activeTab === 'lookups' && (
        <div className="bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col md:flex-row gap-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Sidebar for Sub Masters */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="mb-6">
              <h2 className="text-xl font-black">Sub Masters</h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Manage global lookups</p>
            </div>
            <ul className="space-y-1">
              {subMasterTypes.map(type => (
                <li key={type.id}>
                  <button
                    onClick={() => {
                      setActiveSubMaster(type.id);
                      setIsAddingOption(false);
                      setSubMasterSearch('');
                    }}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-3 ${activeSubMaster === type.id ? 'bg-primary text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}
                  >
                    <span className="material-icons text-[18px] opacity-75">{type.icon}</span>
                    {type.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0 flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
              <h3 className="font-black text-lg text-slate-800 flex items-center gap-2">
                {subMasterTypes.find(t => t.id === activeSubMaster)?.label} List
              </h3>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">search</span>
                  <input 
                    type="text" 
                    placeholder="Search..." 
                    value={subMasterSearch}
                    onChange={(e) => setSubMasterSearch(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-primary focus:border-primary text-sm w-48 transition-all focus:w-64"
                  />
                </div>
                <button 
                  onClick={() => setIsAddingOption(!isAddingOption)}
                  className="bg-slate-900 hover:bg-slate-800 text-white p-2 sm:px-4 sm:py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2"
                >
                  <span className="material-icons text-[18px]">{isAddingOption ? 'close' : 'add'}</span>
                  <span className="hidden sm:inline">{isAddingOption ? 'Cancel' : 'Add New'}</span>
                </button>
              </div>
            </div>

            {/* Add Form */}
            {isAddingOption && (
              <div className="mb-6 p-5 bg-slate-50 rounded-xl border border-slate-200">
                <form onSubmit={handleCreateOption} className="flex flex-col sm:flex-row gap-4 items-end">
                  {activeSubMaster === 'car_model' && (
                    <div className="w-full sm:w-1/3">
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Car Make <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <select 
                          required
                          value={newOptionParentId}
                          onChange={e => setNewOptionParentId(e.target.value)}
                          className="w-full px-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-primary focus:border-primary text-sm font-medium appearance-none cursor-pointer"
                        >
                          <option value="">-- Choose Car Make --</option>
                          {[...options.filter(o => o.option_type === 'car_make')]
                            .sort((a, b) => a.option_value.localeCompare(b.option_value))
                            .map(make => (
                              <option key={make.id} value={make.id}>{make.option_value}</option>
                            ))}
                        </select>
                        <span className="material-icons absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-lg">
                          expand_more
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="flex-1 w-full">
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">{subMasterTypes.find(t => t.id === activeSubMaster)?.label.slice(0,-1)} Name <span className="text-red-500">*</span></label>
                    <input 
                      type="text"
                      required
                      value={newOptionValue}
                      onChange={e => setNewOptionValue(e.target.value)}
                      className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-primary focus:border-primary text-sm"
                      placeholder="Enter value..."
                    />
                  </div>
                  <button 
                    type="submit"
                    disabled={!newOptionValue.trim() || isCreatingOption}
                    className="w-full sm:w-auto bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-lg font-bold text-sm transition-all shadow-md disabled:opacity-50"
                  >
                    {isCreatingOption ? 'Saving...' : 'Save'}
                  </button>
                </form>
              </div>
            )}

            {/* Data Grid Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-200 w-full">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest w-16">ID</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{subMasterTypes.find(t => t.id === activeSubMaster)?.label.slice(0,-1)} Name</th>
                    {activeSubMaster === 'car_model' && (
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Mapped Make</th>
                    )}
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest w-24 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {options
                    .filter(o => o.option_type === activeSubMaster)
                    .filter(o => subMasterSearch ? o.option_value.toLowerCase().includes(subMasterSearch.toLowerCase()) : true)
                    .sort((a, b) => a.option_value.localeCompare(b.option_value))
                    .map(opt => {
                      const parentOpt = activeSubMaster === 'car_model' && opt.parent_id ? options.find(p => Number(p.id) === Number(opt.parent_id)) : null;
                      return (
                        <tr key={opt.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors group">
                          <td className="px-6 py-4 text-xs font-bold text-slate-400 font-mono">#{opt.id}</td>
                          <td className="px-6 py-4 text-sm font-bold text-slate-800">{opt.option_value}</td>
                          {activeSubMaster === 'car_model' && (
                            <td className="px-6 py-4 text-sm font-medium text-slate-600">
                              <div className="relative inline-block">
                                <select 
                                  value={opt.parent_id || ''} 
                                  onChange={(e) => handleUpdateParentId(opt.id, opt.option_type, e.target.value)}
                                  className={`pl-3 pr-8 py-1.5 bg-white border rounded-lg focus:ring-primary focus:border-primary text-xs font-bold w-44 transition-colors appearance-none cursor-pointer ${
                                    opt.parent_id ? 'border-slate-300 text-slate-800' : 'border-amber-300 bg-amber-50/50 text-amber-700'
                                  }`}
                                >
                                  <option value="">-- Unmapped --</option>
                                  {[...options.filter(o => o.option_type === 'car_make')]
                                    .sort((a, b) => a.option_value.localeCompare(b.option_value))
                                    .map(make => (
                                      <option key={make.id} value={make.id}>{make.option_value}</option>
                                    ))}
                                </select>
                                <span className="material-icons absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-base">
                                  expand_more
                                </span>
                              </div>
                            </td>
                          )}
                          <td className="px-6 py-4 text-center">
                            <button 
                              onClick={() => handleDeleteOption(opt.id, opt.option_type)}
                              disabled={isDeletingOption === opt.id}
                              className="text-slate-400 hover:text-red-600 transition-colors p-1.5 rounded-lg hover:bg-red-50 disabled:opacity-50 inline-flex items-center justify-center cursor-pointer"
                              title="Delete"
                            >
                              <span className="material-icons text-[18px]">delete_outline</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  }
                  {options.filter(o => o.option_type === activeSubMaster && (!subMasterSearch || o.option_value.toLowerCase().includes(subMasterSearch.toLowerCase()))).length === 0 && (
                    <tr>
                      <td colSpan={activeSubMaster === 'car_model' ? 4 : 3} className="px-6 py-12 text-center text-slate-400">
                        <span className="material-icons text-4xl mb-2 opacity-50">search_off</span>
                        <p className="text-sm font-medium">No items found</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 5. Email Setup Tab */}
      {activeTab === 'email' && (
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black flex items-center gap-3">
                <span className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <span className="material-icons text-primary">email</span>
                </span>
                Email Server Configuration
              </h2>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-2">Configure SMTP settings for welcome emails and notifications</p>
            </div>
            {emailConfig.smtp_username && (
              <span className="flex items-center gap-2 text-xs font-bold text-green-500 bg-green-50 px-4 py-2 rounded-full">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Configured
              </span>
            )}
          </div>

          {/* Status Messages */}
          {emailSaveMsg && (
            <div className={`mb-6 px-5 py-4 rounded-2xl text-sm font-bold flex items-center gap-3 animate-in fade-in duration-200 ${
              emailSaveMsg.type === 'success' 
                ? 'bg-green-50 border border-green-100 text-green-700' 
                : 'bg-red-50 border border-red-100 text-red-700'
            }`}>
              <span className="material-icons text-lg">
                {emailSaveMsg.type === 'success' ? 'check_circle' : 'error'}
              </span>
              {emailSaveMsg.text}
            </div>
          )}

          <form onSubmit={handleSaveEmailConfig}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Left Column — Server Settings */}
              <div className="space-y-5">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest pb-3 border-b border-slate-100 flex items-center gap-2">
                  <span className="material-icons text-sm text-slate-300">dns</span>
                  SMTP Server
                </h3>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">SMTP Host</label>
                  <div className="relative">
                    <span className="material-icons absolute left-4 top-3.5 text-slate-300 text-lg">cloud</span>
                    <input 
                      type="text"
                      value={emailConfig.smtp_host}
                      onChange={e => setEmailConfig({...emailConfig, smtp_host: e.target.value})}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border-slate-100 rounded-2xl focus:ring-primary focus:border-primary text-sm font-medium"
                      placeholder="smtp.gmail.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Port</label>
                    <input 
                      type="number"
                      value={emailConfig.smtp_port}
                      onChange={e => setEmailConfig({...emailConfig, smtp_port: e.target.value})}
                      className="w-full px-4 py-4 bg-slate-50 border-slate-100 rounded-2xl focus:ring-primary focus:border-primary text-sm font-medium"
                      placeholder="587"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Encryption</label>
                    <select 
                      value={emailConfig.smtp_encryption}
                      onChange={e => setEmailConfig({...emailConfig, smtp_encryption: e.target.value})}
                      className="w-full px-4 py-4 bg-slate-50 border-slate-100 rounded-2xl focus:ring-primary focus:border-primary text-sm font-medium"
                    >
                      <option value="tls">TLS (Port 587)</option>
                      <option value="ssl">SSL (Port 465)</option>
                      <option value="none">None (Port 25)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Right Column — Credentials */}
              <div className="space-y-5">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest pb-3 border-b border-slate-100 flex items-center gap-2">
                  <span className="material-icons text-sm text-slate-300">lock</span>
                  Authentication
                </h3>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">SMTP Username / Email</label>
                  <div className="relative">
                    <span className="material-icons absolute left-4 top-3.5 text-slate-300 text-lg">alternate_email</span>
                    <input 
                      type="email"
                      value={emailConfig.smtp_username}
                      onChange={e => setEmailConfig({...emailConfig, smtp_username: e.target.value})}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border-slate-100 rounded-2xl focus:ring-primary focus:border-primary text-sm font-medium"
                      placeholder="yourname@gmail.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">SMTP Password / App Password</label>
                  <div className="relative">
                    <span className="material-icons absolute left-4 top-3.5 text-slate-300 text-lg">key</span>
                    <input 
                      type={showSmtpPassword ? 'text' : 'password'}
                      value={emailConfig.smtp_password}
                      onChange={e => setEmailConfig({...emailConfig, smtp_password: e.target.value})}
                      className="w-full pl-12 pr-12 py-4 bg-slate-50 border-slate-100 rounded-2xl focus:ring-primary focus:border-primary text-sm font-medium"
                      placeholder="App password (not your regular password)"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSmtpPassword(!showSmtpPassword)}
                      className="absolute right-4 top-3.5 text-slate-400 hover:text-primary transition-colors"
                      tabIndex={-1}
                    >
                      <span className="material-icons text-lg">{showSmtpPassword ? 'visibility_off' : 'visibility'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Sender Identity */}
            <div className="mt-8 pt-6 border-t border-slate-100">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest pb-4 flex items-center gap-2">
                <span className="material-icons text-sm text-slate-300">badge</span>
                Sender Identity
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">From Name</label>
                  <input 
                    type="text"
                    value={emailConfig.smtp_from_name}
                    onChange={e => setEmailConfig({...emailConfig, smtp_from_name: e.target.value})}
                    className="w-full px-4 py-4 bg-slate-50 border-slate-100 rounded-2xl focus:ring-primary focus:border-primary text-sm font-medium"
                    placeholder="HitAds.ca"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">From Email</label>
                  <input 
                    type="email"
                    value={emailConfig.smtp_from_email}
                    onChange={e => setEmailConfig({...emailConfig, smtp_from_email: e.target.value})}
                    className="w-full px-4 py-4 bg-slate-50 border-slate-100 rounded-2xl focus:ring-primary focus:border-primary text-sm font-medium"
                    placeholder="noreply@hitads.ca"
                  />
                </div>
              </div>
            </div>

            {/* Actions Row */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              {/* Test Email */}
              <div className="flex items-center gap-3 flex-grow max-w-md">
                <div className="relative flex-grow">
                  <span className="material-icons absolute left-4 top-3 text-slate-300 text-lg">send</span>
                  <input 
                    type="email"
                    value={testEmail}
                    onChange={e => setTestEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border-slate-100 rounded-xl focus:ring-primary focus:border-primary text-sm font-medium"
                    placeholder="test@example.com"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSendTestEmail}
                  disabled={isSendingTest || !testEmail.trim()}
                  className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs uppercase tracking-widest transition-all disabled:opacity-50 whitespace-nowrap flex items-center gap-2"
                >
                  {isSendingTest ? (
                    <><span className="material-icons text-sm animate-spin">sync</span> Sending...</>
                  ) : (
                    <><span className="material-icons text-sm">send</span> Send Test</>
                  )}
                </button>
              </div>

              {/* Save Button */}
              <button 
                type="submit"
                disabled={isSavingEmail}
                className="bg-primary hover:bg-primary-hover text-white font-black py-4 px-10 rounded-2xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50 text-xs uppercase tracking-widest"
              >
                {isSavingEmail ? (
                  <><span className="material-icons text-sm animate-spin">sync</span> Saving...</>
                ) : (
                  <><span className="material-icons text-sm">save</span> Save Email Settings</>
                )}
              </button>
            </div>
          </form>

          {/* Help Tip */}
          <div className="mt-8 p-5 bg-amber-50 border border-amber-100 rounded-2xl flex items-start gap-4">
            <span className="material-icons text-amber-500 mt-0.5">tips_and_updates</span>
            <div>
              <p className="text-sm font-bold text-amber-800 mb-1">Gmail App Password Setup</p>
              <p className="text-xs text-amber-700 leading-relaxed">
                For Gmail: Enable 2-Factor Authentication, then go to 
                <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noopener" className="font-bold underline"> myaccount.google.com/apppasswords</a> 
                to generate a 16-character App Password. Use that instead of your regular Gmail password.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Listing SEO Tab */}
      {activeTab === 'listing-seo' && (
        <div className="mt-10 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-200 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-black text-slate-900">Listing SEO Manager</h2>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Manage meta titles, descriptions, keywords & image alt text per listing</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleBatchProcessSeo}
                  disabled={isBatchProcessingSeo || seoListings.length === 0}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3 px-6 rounded-xl transition-all text-xs uppercase tracking-widest flex items-center gap-2 shadow-md disabled:opacity-50"
                  title="Process SEO auto-generation in fast parallel batches"
                >
                  <span className="material-icons text-sm">{isBatchProcessingSeo ? 'sync' : 'bolt'}</span>
                  {isBatchProcessingSeo ? `Batching (${batchProgress.current}/${batchProgress.total})` : 'Batch Auto-Generate (Page)'}
                </button>
                <button
                  onClick={() => fetchListingSeo(1)}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-black py-3 px-6 rounded-xl transition-all text-xs uppercase tracking-widest flex items-center gap-2 shadow-md"
                >
                  <span className="material-icons text-sm">refresh</span> Refresh Listings
                </button>
              </div>
            </div>

            {/* Batch Processing Progress Bar */}
            {isBatchProcessingSeo && (
              <div className="mb-6 p-4 bg-indigo-50 border border-indigo-100 rounded-2xl animate-in fade-in">
                <div className="flex justify-between items-center text-xs font-bold text-indigo-700 mb-2">
                  <span className="flex items-center gap-1.5">
                    <span className="material-icons text-sm animate-spin">sync</span>
                    Batch Processing SEO Metadata in Parallel Chunks...
                  </span>
                  <span>{batchProgress.current} / {batchProgress.total} listings ({batchProgress.total > 0 ? Math.round((batchProgress.current / batchProgress.total) * 100) : 0}%)</span>
                </div>
                <div className="w-full bg-indigo-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${batchProgress.total > 0 ? (batchProgress.current / batchProgress.total) * 100 : 0}%` }}
                  />
                </div>
              </div>
            )}

            {/* Alert Messages */}
            {listingSeoMsg && (
              <div className={`mb-4 p-4 rounded-xl text-xs font-bold ${listingSeoMsg.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
                <span className="material-icons text-sm mr-2 align-middle">{listingSeoMsg.type === 'success' ? 'check_circle' : 'error'}</span>
                {listingSeoMsg.text}
              </div>
            )}

            {/* Filters Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              <div className="relative">
                <span className="material-icons text-slate-300 absolute left-3 top-1/2 -translate-y-1/2 text-lg">search</span>
                <input
                  type="text"
                  value={seoSearch}
                  onChange={e => setSeoSearch(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && fetchListingSeo(1)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-primary focus:border-primary text-sm font-medium"
                  placeholder="Search by title or keyword..."
                />
              </div>
              <select
                value={seoCategoryFilter}
                onChange={e => { setSeoCategoryFilter(e.target.value); setTimeout(() => fetchListingSeo(1), 50); }}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-primary focus:border-primary text-sm font-medium"
              >
                <option value="">All Categories</option>
                {seoCategories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select
                value={seoStatusFilter}
                onChange={e => { setSeoStatusFilter(e.target.value); setTimeout(() => fetchListingSeo(1), 50); }}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-primary focus:border-primary text-sm font-medium"
              >
                <option value="">All SEO Status</option>
                <option value="custom">Custom (Manual Override)</option>
                <option value="none">None (Auto Only)</option>
              </select>
              <button
                onClick={() => fetchListingSeo(1)}
                className="w-full bg-primary hover:bg-primary-hover text-white font-black py-2.5 rounded-xl transition-all text-xs uppercase tracking-widest flex items-center justify-center gap-2"
              >
                <span className="material-icons text-sm">filter_list</span> Apply Filters
              </button>
            </div>

            {/* Keywords Overview Table */}
            {seoLoading ? (
              <div className="text-center py-16">
                <span className="material-icons text-4xl text-slate-300 animate-spin">sync</span>
                <p className="text-sm text-slate-400 font-bold mt-3">Loading listings...</p>
              </div>
            ) : seoListings.length === 0 ? (
              <div className="text-center py-16">
                <span className="material-icons text-5xl text-slate-200 mb-3">travel_explore</span>
                <p className="text-sm text-slate-400 font-bold">Click "Load Listings" to populate SEO data</p>
              </div>
            ) : (
              <>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                  Showing {seoListings.length} of {seoTotal} listings
                </div>
                <div className="overflow-x-auto rounded-2xl border border-slate-100 w-full">
                  <table className="w-full text-sm min-w-[800px]">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="text-left px-4 py-3 font-black text-[10px] text-slate-500 uppercase tracking-widest">ID</th>
                        <th className="text-left px-4 py-3 font-black text-[10px] text-slate-500 uppercase tracking-widest">Title</th>
                        <th className="text-left px-4 py-3 font-black text-[10px] text-slate-500 uppercase tracking-widest hidden lg:table-cell">Category</th>
                        <th className="text-left px-4 py-3 font-black text-[10px] text-slate-500 uppercase tracking-widest hidden md:table-cell">Location</th>
                        <th className="text-left px-4 py-3 font-black text-[10px] text-slate-500 uppercase tracking-widest hidden xl:table-cell">Focus Keyword</th>
                        <th className="text-left px-4 py-3 font-black text-[10px] text-slate-500 uppercase tracking-widest">Status</th>
                        <th className="text-left px-4 py-3 font-black text-[10px] text-slate-500 uppercase tracking-widest">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {seoListings.map((listing: any) => {
                        const hasCustom = listing.meta_title || listing.meta_desc || listing.keywords;
                        const status = hasCustom ? 'Custom' : 'Auto';
                        return (
                          <tr key={listing.id} className={`border-b border-slate-50 hover:bg-slate-50/50 transition-colors ${editingSeoListing?.id === listing.id ? 'bg-primary/5' : ''}`}>
                            <td className="px-4 py-3 text-xs text-slate-400 font-mono">#{listing.id}</td>
                            <td className="px-4 py-3">
                              <p className="font-bold text-slate-800 truncate max-w-[220px]">{listing.title}</p>
                              <p className="text-[10px] text-slate-400 font-bold mt-0.5">{formatPrice(listing.price, listing.price_type)}</p>
                            </td>
                            <td className="px-4 py-3 hidden lg:table-cell">
                              <span className="text-xs text-slate-500 font-medium truncate max-w-[140px] inline-block">{listing.category}</span>
                            </td>
                            <td className="px-4 py-3 hidden md:table-cell">
                              <span className="text-xs text-slate-500 font-medium">{listing.location}</span>
                            </td>
                            <td className="px-4 py-3 hidden xl:table-cell">
                              {listing.focus_keyword ? (
                                <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded-lg font-bold">{listing.focus_keyword}</span>
                              ) : (
                                <span className="text-xs text-slate-300">—</span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${
                                status === 'Custom' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                              }`}>{status}</span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex gap-1.5">
                                <button
                                  onClick={() => openSeoEditor(listing)}
                                  className="w-8 h-8 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 flex items-center justify-center transition-colors"
                                  title="Edit SEO"
                                >
                                  <span className="material-icons text-sm">edit</span>
                                </button>
                                {hasCustom && (
                                  <button
                                    onClick={() => handleResetListingSeo(listing.id)}
                                    className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-colors"
                                    title="Reset to auto"
                                  >
                                    <span className="material-icons text-sm">restart_alt</span>
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {seoTotal > 50 && (
                  <div className="flex justify-center gap-2 mt-4">
                    {Array.from({ length: Math.ceil(seoTotal / 50) }, (_, i) => i + 1).map(p => (
                      <button
                        key={p}
                        onClick={() => fetchListingSeo(p)}
                        className={`w-9 h-9 rounded-xl text-xs font-black transition-all ${
                          seoPage === p ? 'bg-primary text-white shadow-md' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                        }`}
                      >{p}</button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Single Listing SEO Editor Panel */}
          {editingSeoListing && (
            <div className="bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-black text-slate-900">Edit SEO — #{editingSeoListing.id} {editingSeoListing.title}</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Fine-tune search engine appearance for this listing</p>
                </div>
                <button
                  onClick={() => setEditingSeoListing(null)}
                  className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
                >
                  <span className="material-icons">close</span>
                </button>
              </div>

              {/* SERP Preview */}
              <div className="mb-8 p-5 bg-slate-50 rounded-2xl border border-slate-200/80">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <span className="material-icons text-sm text-primary">preview</span> Google Search Preview
                </h4>
                <div className="bg-white p-4 rounded-xl border border-slate-100 max-w-xl">
                  <p className="text-[11px] text-green-700 font-medium truncate">
                    hitads.ca › item › {editingSeoListing.id}
                  </p>
                  <p className="text-lg text-blue-800 font-medium hover:underline cursor-pointer truncate leading-tight mt-0.5">
                    {seoForm.meta_title || `${editingSeoListing.title} for Sale in ${editingSeoListing.location} | HitAds.ca`}
                  </p>
                  <p className="text-[13px] text-slate-600 mt-1 line-clamp-2 leading-snug">
                    {seoForm.meta_desc || `Buy ${editingSeoListing.title} in ${editingSeoListing.location} for ${formatPrice(editingSeoListing.price, editingSeoListing.price_type)}. Check pictures, description, seller info on HitAds.ca.`}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Meta Title */}
                <div>
                  <label className="flex items-center justify-between mb-1.5 px-1">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Meta Title</span>
                    <span className={`text-[10px] font-black ${seoForm.meta_title.length > 60 ? 'text-red-500' : seoForm.meta_title.length > 50 ? 'text-amber-500' : 'text-emerald-500'}`}>
                      {seoForm.meta_title.length}/60
                    </span>
                  </label>
                  <input
                    type="text"
                    value={seoForm.meta_title}
                    onChange={e => setSeoForm({ ...seoForm, meta_title: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-primary focus:border-primary text-sm font-medium"
                    placeholder="e.g. Used MacBook Pro in Markham | Buy on HitAds.ca"
                  />
                  <div className="w-full bg-slate-200 rounded-full h-1 mt-1.5">
                    <div className={`h-1 rounded-full transition-all ${seoForm.meta_title.length > 60 ? 'bg-red-500' : seoForm.meta_title.length > 50 ? 'bg-amber-400' : 'bg-emerald-400'}`} style={{ width: `${Math.min(100, (seoForm.meta_title.length / 60) * 100)}%` }} />
                  </div>
                </div>

                {/* Focus Keyword */}
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 px-1">Focus Keyword</label>
                  <input
                    type="text"
                    value={seoForm.focus_keyword}
                    onChange={e => setSeoForm({ ...seoForm, focus_keyword: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-primary focus:border-primary text-sm font-medium"
                    placeholder="e.g. used macbook pro markham"
                  />
                </div>

                {/* Meta Description */}
                <div className="lg:col-span-2">
                  <label className="flex items-center justify-between mb-1.5 px-1">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Meta Description</span>
                    <span className={`text-[10px] font-black ${seoForm.meta_desc.length > 160 ? 'text-red-500' : seoForm.meta_desc.length > 140 ? 'text-amber-500' : 'text-emerald-500'}`}>
                      {seoForm.meta_desc.length}/160
                    </span>
                  </label>
                  <textarea
                    rows={3}
                    value={seoForm.meta_desc}
                    onChange={e => setSeoForm({ ...seoForm, meta_desc: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-primary focus:border-primary text-sm font-medium"
                    placeholder="Compelling description for search results (120-160 characters ideal)"
                  />
                  <div className="w-full bg-slate-200 rounded-full h-1 mt-1.5">
                    <div className={`h-1 rounded-full transition-all ${seoForm.meta_desc.length > 160 ? 'bg-red-500' : seoForm.meta_desc.length > 140 ? 'bg-amber-400' : 'bg-emerald-400'}`} style={{ width: `${Math.min(100, (seoForm.meta_desc.length / 160) * 100)}%` }} />
                  </div>
                </div>

                {/* Keywords */}
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 px-1">Keywords (comma-separated)</label>
                  <textarea
                    rows={2}
                    value={seoForm.keywords}
                    onChange={e => setSeoForm({ ...seoForm, keywords: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-primary focus:border-primary text-sm font-medium"
                    placeholder="macbook pro, used laptop, electronics markham"
                  />
                  {seoForm.keywords && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {seoForm.keywords.split(',').map((kw: string, i: number) => kw.trim() && (
                        <span key={i} className="bg-indigo-50 text-indigo-600 text-[10px] font-bold px-2 py-0.5 rounded-md">{kw.trim()}</span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Image Alt Text */}
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 px-1">Image Alt Text</label>
                  <textarea
                    rows={2}
                    value={seoForm.image_alt_text}
                    onChange={e => setSeoForm({ ...seoForm, image_alt_text: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-primary focus:border-primary text-sm font-medium"
                    placeholder="Used MacBook Pro — Electronics for sale in Markham"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 mt-8 pt-6 border-t border-slate-100">
                <button
                  onClick={() => handleGenerateListingSeo(editingSeoListing.id)}
                  disabled={isGeneratingSeo}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3 px-6 rounded-xl transition-all text-xs uppercase tracking-widest flex items-center gap-2 shadow-md disabled:opacity-50"
                >
                  <span className="material-icons text-sm">{isGeneratingSeo ? 'sync' : 'auto_fix_high'}</span>
                  {isGeneratingSeo ? 'Generating...' : 'Auto-Generate'}
                </button>
                <button
                  onClick={handleSaveListingSeo}
                  disabled={isSavingListingSeo}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-black py-3 px-6 rounded-xl transition-all text-xs uppercase tracking-widest flex items-center gap-2 shadow-md disabled:opacity-50"
                >
                  <span className="material-icons text-sm">{isSavingListingSeo ? 'sync' : 'save'}</span>
                  {isSavingListingSeo ? 'Saving...' : 'Save SEO Data'}
                </button>
                <button
                  onClick={() => handleResetListingSeo(editingSeoListing.id)}
                  className="bg-white hover:bg-red-50 text-red-600 font-black py-3 px-6 rounded-xl transition-all text-xs uppercase tracking-widest flex items-center gap-2 border border-red-200"
                >
                  <span className="material-icons text-sm">restart_alt</span> Reset to Auto
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 6. SEO Settings Tab */}
      {activeTab === 'promotions' && (
        <PromotionsAdmin />
      )}

      {/* ── Approvals Tab ── */}
      {activeTab === 'approvals' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Approval Message */}
          {approvalMsg && (
            <div className={`mb-6 px-5 py-3 rounded-xl text-sm font-bold flex items-center gap-2 ${
              approvalMsg.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              <span className="material-icons text-sm">{approvalMsg.type === 'success' ? 'check_circle' : 'error'}</span>
              {approvalMsg.text}
            </div>
          )}

          {/* Sub-tab Navigation */}
          <div className="flex gap-2 mb-6">
            {[
              { id: 'pending' as const, label: 'Pending Approvals', icon: 'pending_actions', count: pendingApprovals.length },
              { id: 'stages' as const, label: 'Approval Stages', icon: 'linear_scale' },
              { id: 'templates' as const, label: 'Approval Templates', icon: 'description' },
            ].map(st => (
              <button
                key={st.id}
                onClick={() => setApprovalSubTab(st.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 ${
                  approvalSubTab === st.id
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'bg-white text-slate-500 border border-slate-200 hover:text-slate-800 hover:border-slate-300'
                }`}
              >
                <span className="material-icons text-sm">{st.icon}</span>
                {st.label}
                {st.count !== undefined && st.count > 0 && (
                  <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-[10px]">{st.count}</span>
                )}
              </button>
            ))}
          </div>

          {/* ── PENDING APPROVALS SUB-TAB ── */}
          {approvalSubTab === 'pending' && (
            <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
              <div className="mb-6">
                <h2 className="text-xl font-black">Pending Approvals</h2>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Review and approve or reject user-submitted ads</p>
              </div>

              {pendingApprovals.length === 0 ? (
                <div className="text-center py-16">
                  <span className="material-icons text-5xl text-slate-200 mb-4 block">task_alt</span>
                  <p className="text-slate-400 font-bold">No pending approvals</p>
                  <p className="text-slate-300 text-sm mt-1">All ads have been reviewed.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {pendingApprovals.map((listing: any) => (
                    <div key={listing.id} className="border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
                      {/* Listing Header */}
                      <div className="flex items-center gap-4 p-5 bg-slate-50/50 border-b border-slate-100">
                        <div className="w-14 h-14 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200">
                          {listing.image ? (
                            <img src={listing.image} className="w-full h-full object-cover" alt="" />
                          ) : (
                            <span className="w-full h-full flex items-center justify-center material-icons text-slate-400">image</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-black text-slate-800 truncate">{listing.title}</h3>
                          <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                            <span className="flex items-center gap-1"><span className="material-icons text-xs">person</span>{listing.poster?.name || 'Unknown'}</span>
                            <span className="flex items-center gap-1"><span className="material-icons text-xs">location_on</span>{listing.location}</span>
                            <span className="flex items-center gap-1"><span className="material-icons text-xs">sell</span>{listing.category}</span>
                            <span className="font-bold text-primary">${Number(listing.price || 0).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      {/* Approval Stages */}
                      <div className="p-5">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-3">Approval Stages</p>
                        <div className="space-y-3">
                          {(listing.approval_stages || []).map((appr: any) => (
                            <div 
                              key={appr.id} 
                              style={appr.status === 'approved' ? { backgroundColor: '#27AE6008', borderColor: '#27AE6030' } : undefined}
                              className={`flex items-center gap-4 p-3 rounded-xl border ${
                                appr.status === 'approved' ? '' :
                                appr.status === 'rejected' ? 'bg-red-50/50 border-red-200' :
                                'bg-amber-50/30 border-amber-200'
                              }`}
                            >
                              <div 
                                style={appr.status === 'approved' ? { backgroundColor: '#27AE6020', color: '#27AE60' } : undefined}
                                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                  appr.status === 'approved' ? '' :
                                  appr.status === 'rejected' ? 'bg-red-100 text-red-600' :
                                  'bg-amber-100 text-amber-600'
                                }`}
                              >
                                <span className="material-icons text-sm">
                                  {appr.status === 'approved' ? 'check' : appr.status === 'rejected' ? 'close' : 'schedule'}
                                </span>
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-bold text-slate-700">{appr.stage?.stage_name || 'Stage'}</p>
                                {appr.review_note && <p className="text-xs text-slate-400 mt-0.5">{appr.review_note}</p>}
                                {appr.reviewer && <p className="text-xs text-slate-300 mt-0.5">Reviewed by {appr.reviewer.name}</p>}
                              </div>
                              <div className="flex items-center gap-2">
                                {appr.status === 'pending' && (
                                  <>
                                    {rejectNoteId === appr.id ? (
                                      <div className="flex items-center gap-2">
                                        <input
                                          type="text"
                                          value={rejectNote}
                                          onChange={e => setRejectNote(e.target.value)}
                                          placeholder="Rejection reason..."
                                          className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs w-48"
                                        />
                                        <button
                                          onClick={() => handleApproveReject(appr.id, listing.id, 'reject', rejectNote)}
                                          disabled={isProcessingApproval === appr.id}
                                          className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-bold hover:bg-red-600 transition-colors disabled:opacity-50"
                                        >
                                          Confirm
                                        </button>
                                        <button
                                          onClick={() => { setRejectNoteId(null); setRejectNote(''); }}
                                          className="px-2 py-1.5 text-slate-400 hover:text-slate-600 text-xs"
                                        >
                                          Cancel
                                        </button>
                                      </div>
                                    ) : (
                                      <>
                                        <button
                                          onClick={() => handleApproveReject(appr.id, listing.id, 'approve')}
                                          disabled={isProcessingApproval === appr.id}
                                          style={{ backgroundColor: '#27AE60' }}
                                          className="flex items-center gap-1 px-4 py-2 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-sm disabled:opacity-50"
                                        >
                                          {isProcessingApproval === appr.id ? (
                                            <span className="material-icons text-sm animate-spin">sync</span>
                                          ) : (
                                            <span className="material-icons text-sm">check</span>
                                          )}
                                          Approve
                                        </button>
                                        <button
                                          onClick={() => setRejectNoteId(appr.id)}
                                          disabled={isProcessingApproval === appr.id}
                                          className="flex items-center gap-1 px-4 py-2 bg-red-50 text-red-500 border border-red-200 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50"
                                        >
                                          <span className="material-icons text-sm">close</span>
                                          Reject
                                        </button>
                                      </>
                                    )}
                                  </>
                                )}
                                {appr.status !== 'pending' && (
                                  <span 
                                    style={{ backgroundColor: '#27AE6020', color: '#27AE60' }}
                                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest`}
                                  >
                                    {appr.status}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── STAGES SUB-TAB ── */}
          {approvalSubTab === 'stages' && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* Stage Form */}
              <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                <h2 className="text-xl font-black mb-1">{stageFormEditId ? 'Edit Stage' : 'Create Stage'}</h2>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-6">Define steps in the approval pipeline</p>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 block">Stage Name *</label>
                    <input
                      type="text"
                      value={stageFormName}
                      onChange={e => setStageFormName(e.target.value)}
                      placeholder="e.g. Content Review"
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 block">Description</label>
                    <input
                      type="text"
                      value={stageFormDesc}
                      onChange={e => setStageFormDesc(e.target.value)}
                      placeholder="Optional description..."
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 block">Sort Order</label>
                    <input
                      type="number"
                      value={stageFormOrder}
                      onChange={e => setStageFormOrder(parseInt(e.target.value) || 0)}
                      className="w-32 px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleSaveStage}
                      disabled={isSavingStage || !stageFormName.trim()}
                      className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-primary/20 text-sm disabled:opacity-50"
                    >
                      {isSavingStage ? <span className="material-icons text-sm animate-spin">sync</span> : <span className="material-icons text-sm">save</span>}
                      {stageFormEditId ? 'Update Stage' : 'Create Stage'}
                    </button>
                    {stageFormEditId && (
                      <button
                        onClick={() => { setStageFormEditId(null); setStageFormName(''); setStageFormDesc(''); setStageFormOrder(0); }}
                        className="px-5 py-3 text-sm text-slate-500 hover:text-slate-700 font-bold transition-colors"
                      >
                        Cancel Edit
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Stage List */}
              <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                <h2 className="text-xl font-black mb-1">Existing Stages</h2>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-6">{approvalStages.length} stage{approvalStages.length !== 1 ? 's' : ''} defined</p>
                {approvalStages.length === 0 ? (
                  <div className="text-center py-10">
                    <span className="material-icons text-4xl text-slate-200 mb-2 block">linear_scale</span>
                    <p className="text-slate-400 text-sm">No stages created yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {approvalStages.map((stage: any) => (
                      <div key={stage.id} className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                          <span className="material-icons text-sm">checklist</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-sm text-slate-800">{stage.stage_name}</p>
                          {stage.description && <p className="text-xs text-slate-400 mt-0.5">{stage.description}</p>}
                          <p className="text-[10px] text-slate-300 mt-1">Order: {stage.stage_order}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => { setStageFormEditId(stage.id); setStageFormName(stage.stage_name); setStageFormDesc(stage.description || ''); setStageFormOrder(stage.stage_order || 0); }}
                            className="w-8 h-8 rounded-lg bg-slate-100 text-slate-400 hover:bg-primary hover:text-white flex items-center justify-center transition-colors"
                            title="Edit"
                          >
                            <span className="material-icons text-sm">edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteStage(stage.id)}
                            className="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-colors"
                            title="Delete"
                          >
                            <span className="material-icons text-sm">delete</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── TEMPLATES SUB-TAB ── */}
          {approvalSubTab === 'templates' && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* Template Form */}
              <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                <h2 className="text-xl font-black mb-1">{tplFormEditId ? 'Edit Template' : 'Create Template'}</h2>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-6">Bundle stages into reusable templates</p>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 block">Template Name *</label>
                    <input
                      type="text"
                      value={tplFormName}
                      onChange={e => setTplFormName(e.target.value)}
                      placeholder="e.g. Standard Review"
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 block">Description</label>
                    <input
                      type="text"
                      value={tplFormDesc}
                      onChange={e => setTplFormDesc(e.target.value)}
                      placeholder="Optional description..."
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="tpl-default"
                      checked={tplFormIsDefault}
                      onChange={e => setTplFormIsDefault(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer"
                    />
                    <label htmlFor="tpl-default" className="text-sm font-bold text-slate-700 cursor-pointer">Set as Default Template</label>
                  </div>
                  <p className="text-[10px] text-slate-400">The default template applies to all categories that don't have a specific template assigned.</p>

                  {/* Stage Selection */}
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Assign Stages (in order)</label>
                    {approvalStages.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">No stages created yet. Go to the Stages tab to create some first.</p>
                    ) : (
                      <div className="space-y-2">
                        {approvalStages.map((stage: any) => (
                          <label key={stage.id} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                            tplFormStageIds.includes(stage.id) ? 'border-primary bg-primary/5' : 'border-slate-200 hover:border-slate-300'
                          }`}>
                            <input
                              type="checkbox"
                              checked={tplFormStageIds.includes(stage.id)}
                              onChange={e => {
                                if (e.target.checked) {
                                  setTplFormStageIds([...tplFormStageIds, stage.id]);
                                } else {
                                  setTplFormStageIds(tplFormStageIds.filter(id => id !== stage.id));
                                }
                              }}
                              className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer"
                            />
                            <div>
                              <p className="text-sm font-bold text-slate-700">{stage.stage_name}</p>
                              {stage.description && <p className="text-xs text-slate-400">{stage.description}</p>}
                            </div>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={handleSaveTemplate}
                      disabled={isSavingTemplate || !tplFormName.trim() || tplFormStageIds.length === 0}
                      className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-primary/20 text-sm disabled:opacity-50"
                    >
                      {isSavingTemplate ? <span className="material-icons text-sm animate-spin">sync</span> : <span className="material-icons text-sm">save</span>}
                      {tplFormEditId ? 'Update Template' : 'Create Template'}
                    </button>
                    {tplFormEditId && (
                      <button
                        onClick={() => { setTplFormEditId(null); setTplFormName(''); setTplFormDesc(''); setTplFormIsDefault(false); setTplFormCategoryId(null); setTplFormStageIds([]); }}
                        className="px-5 py-3 text-sm text-slate-500 hover:text-slate-700 font-bold transition-colors"
                      >
                        Cancel Edit
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Template List */}
              <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                <h2 className="text-xl font-black mb-1">Existing Templates</h2>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-6">{approvalTemplates.length} template{approvalTemplates.length !== 1 ? 's' : ''} defined</p>
                {approvalTemplates.length === 0 ? (
                  <div className="text-center py-10">
                    <span className="material-icons text-4xl text-slate-200 mb-2 block">description</span>
                    <p className="text-slate-400 text-sm">No templates created yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {approvalTemplates.map((tpl: any) => (
                      <div key={tpl.id} className="p-5 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-black text-slate-800">{tpl.template_name}</p>
                              {tpl.is_default && (
                                <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest">Default</span>
                              )}
                            </div>
                            {tpl.description && <p className="text-xs text-slate-400 mt-1">{tpl.description}</p>}
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setTplFormEditId(tpl.id);
                                setTplFormName(tpl.template_name);
                                setTplFormDesc(tpl.description || '');
                                setTplFormIsDefault(tpl.is_default || false);
                                setTplFormCategoryId(tpl.category_id);
                                setTplFormStageIds((tpl.stages || []).map((s: any) => s.stage_id));
                              }}
                              className="w-8 h-8 rounded-lg bg-slate-100 text-slate-400 hover:bg-primary hover:text-white flex items-center justify-center transition-colors"
                              title="Edit"
                            >
                              <span className="material-icons text-sm">edit</span>
                            </button>
                            <button
                              onClick={() => handleDeleteTemplate(tpl.id)}
                              className="w-8 h-8 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-colors"
                              title="Delete"
                            >
                              <span className="material-icons text-sm">delete</span>
                            </button>
                          </div>
                        </div>
                        {/* Stages assigned */}
                        <div className="flex flex-wrap gap-2">
                          {(tpl.stages || []).map((ts: any, idx: number) => (
                            <span key={ts.id || idx} className="flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold uppercase tracking-widest">
                              <span className="material-icons text-xs">checklist</span>
                              {ts.stage?.stage_name || `Stage #${ts.stage_id}`}
                            </span>
                          ))}
                          {(!tpl.stages || tpl.stages.length === 0) && (
                            <span className="text-xs text-slate-300 italic">No stages assigned</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'seo' && (
        <div className="mt-10 bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col md:flex-row gap-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Sub Tab Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="mb-6">
              <h2 className="text-xl font-black">SEO Settings</h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Optimize Search Engines & Analytics</p>
            </div>
            <ul className="space-y-1">
              {[
                { id: 'general', label: 'General & Analytics', icon: 'analytics' },
                { id: 'meta', label: 'Page Meta Tags', icon: 'description' },
                { id: 'robots', label: 'robots.txt Configuration', icon: 'smart_toy' },
                { id: 'schema', label: 'Structured Data (Schema)', icon: 'code' }
              ].map(sub => (
                <li key={sub.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveSeoSubTab(sub.id);
                      setSeoSaveMsg(null);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-3 ${
                      activeSeoSubTab === sub.id
                        ? 'bg-slate-900 text-white shadow-md'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="material-icons text-[18px] opacity-75">{sub.icon}</span>
                    {sub.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Sub Tab Main Area */}
          <div className="flex-1 min-w-0">
            {seoSaveMsg && (
              <div className={`mb-6 px-5 py-4 rounded-2xl text-sm font-bold flex items-center gap-3 animate-in fade-in duration-200 ${
                seoSaveMsg.type === 'success' 
                  ? 'bg-green-50 border border-green-100 text-green-700' 
                  : 'bg-red-50 border border-red-100 text-red-700'
              }`}>
                <span className="material-icons text-lg">
                  {seoSaveMsg.type === 'success' ? 'check_circle' : 'error'}
                </span>
                {seoSaveMsg.text}
              </div>
            )}

            <form onSubmit={handleSaveSeoSettings} className="space-y-6">
              {/* General & Analytics Sub-tab */}
              {activeSeoSubTab === 'general' && (
                <div className="space-y-5">
                  <div>
                    <h3 className="font-black text-lg text-slate-800 mb-2">Tracking & Analytics Integrations</h3>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-4">Connect analytics platforms to track visitor behavior and listings conversions</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Google Tag Manager ID</label>
                      <input 
                        type="text"
                        value={seoSettings.gtm_id || ''}
                        onChange={e => setSeoSettings({...seoSettings, gtm_id: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-primary focus:border-primary text-sm font-medium"
                        placeholder="GTM-XXXXXXX"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Google Analytics 4 ID</label>
                      <input 
                        type="text"
                        value={seoSettings.ga4_id || ''}
                        onChange={e => setSeoSettings({...seoSettings, ga4_id: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-primary focus:border-primary text-sm font-medium"
                        placeholder="G-XXXXXXXXXX"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Meta Pixel ID</label>
                      <input 
                        type="text"
                        value={seoSettings.meta_pixel_id || ''}
                        onChange={e => setSeoSettings({...seoSettings, meta_pixel_id: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-primary focus:border-primary text-sm font-medium"
                        placeholder="XXXXXXXXXXXXXXXX"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-4">
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Google Ads Tag ID</label>
                      <input 
                        type="text"
                        value={seoSettings.google_ads_id || ''}
                        onChange={e => setSeoSettings({...seoSettings, google_ads_id: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-primary focus:border-primary text-sm font-medium"
                        placeholder="AW-XXXXXXXXXX"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Google Search Console Verification Tag</label>
                      <input 
                        type="text"
                        value={seoSettings.google_site_verification || ''}
                        onChange={e => setSeoSettings({...seoSettings, google_site_verification: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-primary focus:border-primary text-sm font-medium"
                        placeholder="e.g. c-cidgyEcNErCFJpYOhfp_RQm8Cqm9Xn1uHpVmNkvVM"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Page Meta Tags Sub-tab */}
              {activeSeoSubTab === 'meta' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-black text-lg text-slate-800 mb-2">Meta Configuration</h3>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-4">Edit page title tags and meta descriptions for search engines</p>
                  </div>

                  <div className="max-h-[500px] overflow-y-auto space-y-6 pr-2">
                    {[
                      { key: 'home', label: 'Homepage' },
                      { key: 'search', label: 'Search Results Page' },
                      { key: 'toronto-classifieds', label: 'Toronto Ads (/toronto-classifieds)' },
                      { key: 'buy-and-sell-toronto', label: 'Buy & Sell Toronto (/buy-and-sell-toronto)' },
                      { key: 'local-services-toronto', label: 'Local Services Toronto (/local-services-toronto)' },
                      { key: 'jobs-toronto', label: 'Jobs Toronto (/jobs-toronto)' },
                      { key: 'real-estate-toronto', label: 'Real Estate Toronto (/real-estate-toronto)' },
                      { key: 'sri-lankan-marketplace-canada', label: 'Sri Lankan Marketplace (/sri-lankan-marketplace-canada)' },
                      { key: 'contact', label: 'Contact Us Page' },
                      { key: 'help', label: 'Help Center Page' },
                      { key: 'terms', label: 'Terms & Conditions Page' },
                      { key: 'buying-guides', label: 'Buying Guides Page' },
                      { key: 'safety-tips', label: 'Safety Tips Page' },
                      { key: 'selling-advice', label: 'Selling Advice Page' },
                      { key: 'market-trends', label: 'Market Trends Page' }
                    ].map(route => (
                      <div key={route.key} className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80">
                        <h4 className="font-black text-sm text-slate-700 mb-3">{route.label}</h4>
                        <div className="grid grid-cols-1 gap-4">
                          <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 px-1">Page Title Tag</label>
                            <input 
                              type="text"
                              value={seoSettings[`page_title_${route.key}`] || ''}
                              onChange={e => setSeoSettings({...seoSettings, [`page_title_${route.key}`]: e.target.value})}
                              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-primary focus:border-primary text-sm font-medium"
                              placeholder="Enter SEO page title"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 px-1">Meta Description</label>
                            <textarea 
                              rows={2}
                              value={seoSettings[`meta_desc_${route.key}`] || ''}
                              onChange={e => setSeoSettings({...seoSettings, [`meta_desc_${route.key}`]: e.target.value})}
                              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-primary focus:border-primary text-sm font-medium"
                              placeholder="Enter SEO meta description (keep between 120-160 characters)"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* robots.txt Sub-tab */}
              {activeSeoSubTab === 'robots' && (
                <div className="space-y-5">
                  <div>
                    <h3 className="font-black text-lg text-slate-800 mb-2">robots.txt Configuration</h3>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-4">Control crawler crawl rules. Saving will update the physical robots.txt file in the site root.</p>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">robots.txt Content</label>
                    <textarea 
                      rows={8}
                      value={seoSettings.robots_txt || ''}
                      onChange={e => setSeoSettings({...seoSettings, robots_txt: e.target.value})}
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-primary focus:border-primary font-mono text-xs leading-relaxed"
                      placeholder="User-agent: *&#10;Allow: /"
                    />
                  </div>
                </div>
              )}

              {/* Social Profiles Sub-tab */}
              {activeSeoSubTab === 'social' && (
                <div className="space-y-5">
                  <div>
                    <h3 className="font-black text-lg text-slate-800 mb-2">Social Media Profiles</h3>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-4">Configure links to your official social media pages displayed in the website footer.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Facebook URL</label>
                      <input
                        type="url"
                        value={seoSettings.social_facebook || ''}
                        onChange={e => setSeoSettings({...seoSettings, social_facebook: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-primary focus:border-primary text-sm font-medium"
                        placeholder="https://facebook.com/yourpage"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Twitter / X URL</label>
                      <input
                        type="url"
                        value={seoSettings.social_x || ''}
                        onChange={e => setSeoSettings({...seoSettings, social_x: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-primary focus:border-primary text-sm font-medium"
                        placeholder="https://x.com/yourhandle"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Instagram URL</label>
                      <input
                        type="url"
                        value={seoSettings.social_instagram || ''}
                        onChange={e => setSeoSettings({...seoSettings, social_instagram: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-primary focus:border-primary text-sm font-medium"
                        placeholder="https://instagram.com/yourhandle"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Schema JSON-LD Sub-tab */}
              {activeSeoSubTab === 'schema' && (
                <div className="space-y-5">
                  <div>
                    <h3 className="font-black text-lg text-slate-800 mb-2">Homepage JSON-LD Schema Markup</h3>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-4">Inject custom Schema.org script blocks into the homepage header payload (include raw &lt;script&gt; tags)</p>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Schema Markup</label>
                    <textarea 
                      rows={12}
                      value={seoSettings.homepage_schema_markup || ''}
                      onChange={e => setSeoSettings({...seoSettings, homepage_schema_markup: e.target.value})}
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-primary focus:border-primary font-mono text-xs leading-relaxed"
                      placeholder="<script type=&quot;application/ld+json&quot;>&#10;{&#10;  ...&#10;}&#10;</script>"
                    />
                  </div>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="pt-6 border-t border-slate-100 flex items-center justify-end">
                <button
                  type="submit"
                  disabled={isSavingSeo}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-black py-4 px-8 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 text-xs uppercase tracking-widest"
                >
                  {isSavingSeo ? (
                    <><span className="material-icons text-sm animate-spin">sync</span> Saving...</>
                  ) : (
                    <><span className="material-icons text-sm">save</span> Save SEO Settings</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 9. Homepage & Footer Tab */}
      {activeTab === 'social' && (
        <div className="bg-white p-6 sm:p-8 rounded-[2rem] border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="mb-6">
            <h2 className="text-xl font-black">Homepage & Footer Settings</h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
              Manage hero section text, tags, and footer profiles.
            </p>
          </div>

          {socialSaveMsg && (
            <div className={`mb-6 px-5 py-4 rounded-2xl text-sm font-bold flex items-center gap-3 animate-in fade-in duration-200 ${
              socialSaveMsg.type === 'success' 
                ? 'bg-green-50 border border-green-100 text-green-700' 
                : 'bg-red-50 border border-red-100 text-red-700'
            }`}>
              <span className="material-icons text-lg">
                {socialSaveMsg.type === 'success' ? 'check_circle' : 'error'}
              </span>
              {socialSaveMsg.text}
            </div>
          )}

          <form onSubmit={handleSaveSocialProfiles} className="space-y-6">
            {/* Hero Section Configuration */}
            <div className="space-y-4">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest pb-3 border-b border-slate-100 flex items-center gap-2">
                <span className="material-icons text-sm text-slate-300">branding_watermark</span>
                Homepage Hero Wordings
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Hero Title Line 1</label>
                  <input
                    type="text"
                    value={seoSettings.homepage_hero_title_1 || ''}
                    onChange={e => setSeoSettings({...seoSettings, homepage_hero_title_1: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-primary focus:border-primary text-sm font-medium"
                    placeholder="Find what you need,"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Hero Title Line 2 (Highlighted)</label>
                  <input
                    type="text"
                    value={seoSettings.homepage_hero_title_2 || ''}
                    onChange={e => setSeoSettings({...seoSettings, homepage_hero_title_2: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-primary focus:border-primary text-sm font-medium"
                    placeholder="right in your community."
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Tag 1 (Slate)</label>
                  <input
                    type="text"
                    value={seoSettings.homepage_hero_tag_1 || ''}
                    onChange={e => setSeoSettings({...seoSettings, homepage_hero_tag_1: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-primary focus:border-primary text-sm font-medium"
                    placeholder="Free Ads."
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Tag 2 (Red)</label>
                  <input
                    type="text"
                    value={seoSettings.homepage_hero_tag_2 || ''}
                    onChange={e => setSeoSettings({...seoSettings, homepage_hero_tag_2: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-primary focus:border-primary text-sm font-medium"
                    placeholder="Sell Fast."
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Tag 3 (Blue)</label>
                  <input
                    type="text"
                    value={seoSettings.homepage_hero_tag_3 || ''}
                    onChange={e => setSeoSettings({...seoSettings, homepage_hero_tag_3: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-primary focus:border-primary text-sm font-medium"
                    placeholder="Buy Local."
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Tag 4 (Red)</label>
                  <input
                    type="text"
                    value={seoSettings.homepage_hero_tag_4 || ''}
                    onChange={e => setSeoSettings({...seoSettings, homepage_hero_tag_4: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-primary focus:border-primary text-sm font-medium"
                    placeholder="Canada-Wide."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Number of Ads to Show</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={seoSettings.homepage_ad_count || 12}
                    onChange={e => setSeoSettings({...seoSettings, homepage_ad_count: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-primary focus:border-primary text-sm font-medium"
                    placeholder="12"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Listing Map Width (e.g. 100%, 250px)</label>
                  <input
                    type="text"
                    value={seoSettings.listing_map_width || '100%'}
                    onChange={e => setSeoSettings({...seoSettings, listing_map_width: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-primary focus:border-primary text-sm font-medium"
                    placeholder="100%"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Listing Map Height (e.g. 200px, 300px)</label>
                  <input
                    type="text"
                    value={seoSettings.listing_map_height || '200px'}
                    onChange={e => setSeoSettings({...seoSettings, listing_map_height: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-primary focus:border-primary text-sm font-medium"
                    placeholder="200px"
                  />
                </div>
              </div>
            </div>

            {/* Social & Footer Profiles Section */}
            <div className="space-y-4 pt-6 border-t border-slate-100">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest pb-3 border-b border-slate-100 flex items-center gap-2">
                <span className="material-icons text-sm text-slate-300">share</span>
                Social Profiles & Footer Copyright
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Facebook URL</label>
                  <input
                    type="url"
                    value={seoSettings.social_facebook || ''}
                    onChange={e => setSeoSettings({...seoSettings, social_facebook: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-primary focus:border-primary text-sm font-medium"
                    placeholder="https://facebook.com/yourpage"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Twitter / X URL</label>
                  <input
                    type="url"
                    value={seoSettings.social_x || ''}
                    onChange={e => setSeoSettings({...seoSettings, social_x: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-primary focus:border-primary text-sm font-medium"
                    placeholder="https://x.com/yourhandle"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Instagram / Hashtag URL</label>
                  <input
                    type="url"
                    value={seoSettings.social_instagram || ''}
                    onChange={e => setSeoSettings({...seoSettings, social_instagram: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-primary focus:border-primary text-sm font-medium"
                    placeholder="https://instagram.com/yourhandle"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Footer Copyright / Description Text</label>
                  <textarea
                    rows={3}
                    value={seoSettings.footer_copyright_text || ''}
                    onChange={e => setSeoSettings({...seoSettings, footer_copyright_text: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-primary focus:border-primary text-sm font-medium"
                    placeholder="© 2026 HitAds.ca — Post free ads, sell fast, buy local, and connect with buyers and sellers across Canada."
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex items-center justify-end">
              <button 
                type="submit"
                disabled={isSavingSocial}
                className="bg-primary hover:bg-primary-hover text-white font-black py-4 px-10 rounded-2xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50 text-xs uppercase tracking-widest"
              >
                {isSavingSocial ? (
                  <><span className="material-icons text-sm animate-spin">sync</span> Saving...</>
                ) : (
                  <><span className="material-icons text-sm">save</span> Save Settings</>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Ad Templates Tab ── */}
      {activeTab === 'templates' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

            {/* LEFT: Category Selector + Config */}
            <div className="xl:col-span-2 space-y-6">
              {/* Category Selection */}
              <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-8">
                <h2 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
                  <span className="material-icons text-primary">folder_open</span>
                  Select Category
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Main Category */}
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Main Category</label>
                    <div className="relative">
                      <select
                        id="tpl-main-category"
                        value={tplMainCatId || ''}
                        onChange={e => { setTplMainCatId(e.target.value ? Number(e.target.value) : null); setTplSubCatId(null); setTplL3CatId(null); }}
                        className="w-full h-12 pl-4 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all appearance-none cursor-pointer text-slate-800"
                      >
                        <option value="">— Choose —</option>
                        {tplCategories.map((c: any) => (
                          <option key={c.CategoryID} value={c.CategoryID}>{c.CategoryName}</option>
                        ))}
                      </select>
                      <span className="material-icons absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xl">
                        expand_more
                      </span>
                    </div>
                  </div>

                  {/* Sub-Category */}
                  {tplMainCatId && (() => {
                    const mainCat = tplCategories.find((c: any) => c.CategoryID == tplMainCatId);
                    const subs = mainCat?.children || [];
                    if (subs.length === 0) return null;
                    return (
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Sub-Category</label>
                        <div className="relative">
                          <select
                            id="tpl-sub-category"
                            value={tplSubCatId || ''}
                            onChange={e => { setTplSubCatId(e.target.value ? Number(e.target.value) : null); setTplL3CatId(null); }}
                            className="w-full h-12 pl-4 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all appearance-none cursor-pointer text-slate-800"
                          >
                            <option value="">— All sub-categories (Main) —</option>
                            {subs.map((c: any) => (
                              <option key={c.CategoryID} value={c.CategoryID}>{c.CategoryName}</option>
                            ))}
                          </select>
                          <span className="material-icons absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xl">
                            expand_more
                          </span>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Level 3 */}
                  {tplSubCatId && (() => {
                    const mainCat = tplCategories.find((c: any) => c.CategoryID == tplMainCatId);
                    const subCat = mainCat?.children?.find((c: any) => c.CategoryID == tplSubCatId);
                    const l3s = subCat?.children || [];
                    if (l3s.length === 0) return null;
                    return (
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Level 3</label>
                        <div className="relative">
                          <select
                            id="tpl-l3-category"
                            value={tplL3CatId || ''}
                            onChange={e => setTplL3CatId(e.target.value ? Number(e.target.value) : null)}
                            className="w-full h-12 pl-4 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all appearance-none cursor-pointer text-slate-800"
                          >
                            <option value="">— All (Sub-Category) —</option>
                            {l3s.map((c: any) => (
                              <option key={c.CategoryID} value={c.CategoryID}>{c.CategoryName}</option>
                            ))}
                          </select>
                          <span className="material-icons absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xl">
                            expand_more
                          </span>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Inheritance Badge */}
                {(tplMainCatId || tplSubCatId || tplL3CatId) && (
                  <div className="mt-5 flex items-center gap-3 flex-wrap">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-slate-100 text-slate-600">
                      <span className="material-icons text-sm">tune</span>
                      {getSelectedCatName()}
                    </span>
                    {tplInheritedFrom && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                        <span className="material-icons text-sm">link</span>
                        Inheriting from "{tplInheritedFrom}"
                      </span>
                    )}
                    {tplIsOwn && (tplSubCatId || tplL3CatId) && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-green-50 text-green-700 border border-green-200">
                        <span className="material-icons text-sm">check_circle</span>
                        Own Template
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Standard Fields Settings */}
              {(tplMainCatId || tplSubCatId || tplL3CatId) && (
                <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-8">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
                    <div>
                      <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                        <span className="material-icons text-primary">toggle_on</span>
                        Standard Fields
                      </h2>
                      <p className="text-xs text-slate-400 font-medium mt-0.5">Toggle and customize fields for this category template.</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {(tplSubCatId || tplL3CatId) && tplIsOwn && (
                        <button
                          onClick={() => showConfirm({ title: 'Reset Template', message: 'Reset template for this category? It will inherit from its parent instead.', onConfirm: doTplReset })}
                          disabled={tplSaving}
                          className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                        >
                          <span className="material-icons text-sm">restart_alt</span> Reset
                        </button>
                      )}
                      <button
                        onClick={handleTplSave}
                        disabled={tplSaving}
                        className="px-5 py-2 bg-primary hover:bg-primary-hover text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-primary/20 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        {tplSaving ? <><span className="material-icons text-sm animate-spin">refresh</span> Saving...</> : <><span className="material-icons text-sm">save</span> Save Template</>}
                      </button>
                    </div>
                  </div>

                  {tplMsg && (
                    <div className={`mb-6 px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-2 ${
                      tplMsg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                      <span className="material-icons text-sm">{tplMsg.type === 'success' ? 'check_circle' : 'error'}</span>
                      {tplMsg.text}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
                    {/* Title & Description & Location */}
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-slate-700">Show Title</span>
                        <button onClick={() => setTplConfig({...tplConfig, hideTitle: !tplConfig.hideTitle})} className={`w-11 h-6 rounded-full transition-colors relative ${tplConfig.hideTitle ? 'bg-slate-300' : 'bg-primary'}`}>
                          <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${tplConfig.hideTitle ? 'left-0.5' : 'left-[22px]'}`} />
                        </button>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-slate-700">Show Description</span>
                        <button onClick={() => setTplConfig({...tplConfig, hideDescription: !tplConfig.hideDescription})} className={`w-11 h-6 rounded-full transition-colors relative ${tplConfig.hideDescription ? 'bg-slate-300' : 'bg-primary'}`}>
                          <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${tplConfig.hideDescription ? 'left-0.5' : 'left-[22px]'}`} />
                        </button>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-slate-700">Show Location</span>
                        <button onClick={() => setTplConfig({...tplConfig, hideLocation: !tplConfig.hideLocation})} className={`w-11 h-6 rounded-full transition-colors relative ${tplConfig.hideLocation ? 'bg-slate-300' : 'bg-primary'}`}>
                          <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${tplConfig.hideLocation ? 'left-0.5' : 'left-[22px]'}`} />
                        </button>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-slate-700">Show Price</span>
                        <button onClick={() => setTplConfig({...tplConfig, hidePrice: !tplConfig.hidePrice})} className={`w-11 h-6 rounded-full transition-colors relative ${tplConfig.hidePrice ? 'bg-slate-300' : 'bg-primary'}`}>
                          <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${tplConfig.hidePrice ? 'left-0.5' : 'left-[22px]'}`} />
                        </button>
                      </div>
                      {!tplConfig.hidePrice && (
                        <>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-slate-500">Price Required</span>
                            <button onClick={() => setTplConfig({...tplConfig, priceRequired: tplConfig.priceRequired === false ? true : false})} className={`w-11 h-6 rounded-full transition-colors relative ${tplConfig.priceRequired === false ? 'bg-slate-300' : 'bg-primary'}`}>
                              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${tplConfig.priceRequired === false ? 'left-0.5' : 'left-[22px]'}`} />
                            </button>
                          </div>
                          <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Price Label</label>
                            <input type="text" value={tplConfig.priceLabel || ''} onChange={e => setTplConfig({...tplConfig, priceLabel: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" placeholder="Price" />
                          </div>
                          <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Price Placeholder</label>
                            <input type="text" value={tplConfig.pricePlaceholder || ''} onChange={e => setTplConfig({...tplConfig, pricePlaceholder: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" placeholder="0.00" />
                          </div>
                        </>
                      )}
                    </div>

                    {/* Condition */}
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-slate-700">Show Condition</span>
                        <button onClick={() => setTplConfig({...tplConfig, hideCondition: !tplConfig.hideCondition})} className={`w-11 h-6 rounded-full transition-colors relative ${tplConfig.hideCondition ? 'bg-slate-300' : 'bg-primary'}`}>
                          <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${tplConfig.hideCondition ? 'left-0.5' : 'left-[22px]'}`} />
                        </button>
                      </div>
                    </div>

                    {/* Photos */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-slate-700">Show Photos</span>
                        <button onClick={() => setTplConfig({...tplConfig, hidePhotos: !tplConfig.hidePhotos})} className={`w-11 h-6 rounded-full transition-colors relative ${tplConfig.hidePhotos ? 'bg-slate-300' : 'bg-primary'}`}>
                          <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${tplConfig.hidePhotos ? 'left-0.5' : 'left-[22px]'}`} />
                        </button>
                      </div>
                      {!tplConfig.hidePhotos && (
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-slate-500">Photos Required</span>
                          <button onClick={() => setTplConfig({...tplConfig, photosRequired: tplConfig.photosRequired === false ? true : false})} className={`w-11 h-6 rounded-full transition-colors relative ${tplConfig.photosRequired === false ? 'bg-slate-300' : 'bg-primary'}`}>
                            <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${tplConfig.photosRequired === false ? 'left-0.5' : 'left-[22px]'}`} />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-slate-700">Show Phone</span>
                        <button onClick={() => setTplConfig({...tplConfig, hidePhone: !tplConfig.hidePhone})} className={`w-11 h-6 rounded-full transition-colors relative ${tplConfig.hidePhone ? 'bg-slate-300' : 'bg-primary'}`}>
                          <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${tplConfig.hidePhone ? 'left-0.5' : 'left-[22px]'}`} />
                        </button>
                      </div>
                    </div>

                    {/* Social Links */}
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-slate-700">Show Social Links</span>
                        <button onClick={() => setTplConfig({...tplConfig, hideSocialLinks: !tplConfig.hideSocialLinks})} className={`w-11 h-6 rounded-full transition-colors relative ${tplConfig.hideSocialLinks ? 'bg-slate-300' : 'bg-primary'}`}>
                          <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${tplConfig.hideSocialLinks ? 'left-0.5' : 'left-[22px]'}`} />
                        </button>
                      </div>
                    </div>
                    {/* Car Features */}
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-slate-700">Show Car Features</span>
                        <button onClick={() => setTplConfig({...tplConfig, hideCarFeatures: !tplConfig.hideCarFeatures})} className={`w-11 h-6 rounded-full transition-colors relative ${tplConfig.hideCarFeatures ? 'bg-slate-300' : 'bg-primary'}`}>
                          <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${tplConfig.hideCarFeatures ? 'left-0.5' : 'left-[22px]'}`} />
                        </button>
                      </div>
                      {!tplConfig.hideCarFeatures && (
                        <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Select Available Features</label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {["Alloy Wheels", "Bluetooth", "Cruise Control", "Navigation System", "Sunroof/Moonroof", "Backup Camera", "Leather Seats", "Remote Start", "Blind Spot Monitor", "Heated Seats"].map(f => {
                              const isEnabled = tplConfig.carFeaturesList ? tplConfig.carFeaturesList.includes(f) : true;
                              return (
                                <label key={f} className="flex items-center gap-3 cursor-pointer group">
                                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isEnabled ? 'bg-primary border-primary' : 'bg-white border-slate-300 group-hover:border-primary'}`}>
                                    {isEnabled && <span className="material-icons text-white text-[14px]">check</span>}
                                  </div>
                                  <span className="text-sm font-medium text-slate-700">{f}</span>
                                  <input 
                                    type="checkbox" 
                                    className="hidden"
                                    checked={isEnabled}
                                    onChange={(e) => {
                                      let current: string[] = tplConfig.carFeaturesList || ["Alloy Wheels", "Bluetooth", "Cruise Control", "Navigation System", "Sunroof/Moonroof", "Backup Camera", "Leather Seats", "Remote Start", "Blind Spot Monitor", "Heated Seats"];
                                      if (e.target.checked) current = [...current, f];
                                      else current = current.filter((x: string) => x !== f);
                                      setTplConfig({...tplConfig, carFeaturesList: current});
                                    }}
                                  />
                                </label>
                              )
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Brand & Model */}
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-slate-700">Show Brand & Model</span>
                        <button onClick={() => setTplConfig({...tplConfig, hideBrandModel: !tplConfig.hideBrandModel})} className={`w-11 h-6 rounded-full transition-colors relative ${tplConfig.hideBrandModel ? 'bg-slate-300' : 'bg-primary'}`}>
                          <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${tplConfig.hideBrandModel ? 'left-0.5' : 'left-[22px]'}`} />
                        </button>
                      </div>
                    </div>

                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-8 pt-6 border-t border-slate-100">
                    <button
                      id="tpl-save-btn"
                      onClick={handleTplSave}
                      disabled={tplSaving}
                      className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl text-sm font-black hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                      {tplSaving ? <><span className="material-icons text-sm animate-spin">refresh</span> Saving...</> : <><span className="material-icons text-sm">save</span> Save Template</>}
                    </button>
                    {(tplSubCatId || tplL3CatId) && tplIsOwn && (
                      <button
                        id="tpl-reset-btn"
                        onClick={() => showConfirm({ title: 'Reset Template', message: 'Reset template for this category? It will inherit from its parent instead.', onConfirm: doTplReset })}
                        disabled={tplSaving}
                        className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors disabled:opacity-50"
                      >
                        <span className="material-icons text-sm">restart_alt</span> Reset to Parent
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT: Custom Attributes */}
            <div className="space-y-6">
              {(tplMainCatId || tplSubCatId || tplL3CatId) && (
                <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-8">
                  <h2 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
                    <span className="material-icons text-primary">list_alt</span>
                    Custom Attributes
                  </h2>

                  {/* Existing Attributes */}
                  {tplAttributes.length > 0 ? (
                    <div className="space-y-3 mb-6">
                      {tplAttributes.map((attr: any) => (
                        <div key={attr.AttributeID} className="flex items-center justify-between px-4 py-3 bg-slate-50 rounded-xl group">
                          <div>
                            <p className="text-sm font-bold text-slate-700">{attr.AttributeName}</p>
                            <p className="text-xs text-slate-400">
                              {attr.AttributeType}
                              {attr.IsRequired ? ' · Required' : ''}
                              {attr.options?.length > 0 ? ` · ${attr.options.join(', ')}` : ''}
                            </p>
                          </div>
                          <button
                            onClick={() => showConfirm({ title: 'Delete Attribute', message: 'Delete this custom attribute?', onConfirm: () => doTplDeleteAttr(attr.AttributeID) })}
                            disabled={tplDeletingAttr === attr.AttributeID}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <span className="material-icons text-sm">{tplDeletingAttr === attr.AttributeID ? 'hourglass_empty' : 'delete'}</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400 mb-6">No custom attributes yet.</p>
                  )}

                  {/* Add Attribute Form */}
                  <div className="border-t border-slate-100 pt-6 space-y-4">
                    <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Add Attribute</h3>
                    <input
                      type="text"
                      value={tplNewAttrName}
                      onChange={e => setTplNewAttrName(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                      placeholder="Attribute name..."
                    />
                    <div className="relative">
                      <select
                        value={tplNewAttrType}
                        onChange={e => setTplNewAttrType(e.target.value)}
                        className="w-full h-12 pl-4 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all appearance-none cursor-pointer text-slate-800"
                      >
                        <option value="Text">Text</option>
                        <option value="Number">Number</option>
                        <option value="Dropdown">Dropdown</option>
                        <option value="CheckboxGroup">Checkbox Group</option>
                      </select>
                      <span className="material-icons absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xl">
                        expand_more
                      </span>
                    </div>
                    {(tplNewAttrType === 'Dropdown' || tplNewAttrType === 'CheckboxGroup') && (
                      <input
                        type="text"
                        value={tplNewAttrOptions}
                        onChange={e => setTplNewAttrOptions(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                        placeholder="Options (comma-separated)..."
                      />
                    )}
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={tplNewAttrRequired} onChange={e => setTplNewAttrRequired(e.target.checked)} className="w-4 h-4 text-primary rounded border-slate-300" />
                      <span className="text-sm font-medium text-slate-600">Required</span>
                    </label>
                    <button
                      id="tpl-add-attr-btn"
                      onClick={handleTplAddAttr}
                      disabled={tplAddingAttr || !tplNewAttrName.trim()}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 text-white rounded-xl text-sm font-bold hover:bg-slate-700 transition-colors disabled:opacity-50"
                    >
                      {tplAddingAttr ? <><span className="material-icons text-sm animate-spin">refresh</span> Adding...</> : <><span className="material-icons text-sm">add</span> Add Attribute</>}
                    </button>
                  </div>
                </div>
              )}

              {/* Help Card */}
              <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-[2rem] border border-primary/10 p-8">
                <h3 className="text-sm font-black text-primary mb-3 flex items-center gap-2">
                  <span className="material-icons text-sm">help_outline</span>
                  How Templates Work
                </h3>
                <ul className="text-xs text-slate-600 space-y-2 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="material-icons text-primary text-sm mt-0.5">arrow_right</span>
                    Set a template on a <strong>Main Category</strong> — all its sub-categories will inherit it.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="material-icons text-primary text-sm mt-0.5">arrow_right</span>
                    Create an <strong>override</strong> on any sub-category to customize it differently.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="material-icons text-primary text-sm mt-0.5">arrow_right</span>
                    Use <strong>"Reset to Parent"</strong> to remove a sub-category override and fall back to the parent.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="material-icons text-primary text-sm mt-0.5">arrow_right</span>
                    <strong>Custom Attributes</strong> are specific to the selected category level.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
