# 🧪 PLantum User Testing Checklist

## 🚀 **Step-by-Step Testing Guide**

### **Step 1: Open Your Browser**
1. Open your web browser (Chrome, Firefox, Safari, etc.)
2. Go to: `http://localhost:3000`
3. You should see the PLantum homepage

---

## 📱 **Mobile Testing (IMPORTANT!)**

### **Test on Mobile/Tablet:**
1. **Open browser developer tools:**
   - **Chrome/Edge:** Press `F12` or `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac)
   - **Firefox:** Press `F12` or `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac)
   - **Safari:** Press `Cmd+Option+I` (Mac)

2. **Switch to mobile view:**
   - Click the mobile/tablet icon in developer tools
   - Or press `Ctrl+Shift+M` (Windows) / `Cmd+Shift+M` (Mac)
   - Try different device sizes (iPhone, iPad, etc.)

---

## 🏠 **Homepage Testing**

### **What to Check:**
- [ ] **Page loads quickly** (under 3 seconds)
- [ ] **Navigation menu appears** (desktop: top menu, mobile: hamburger menu)
- [ ] **All text is readable** and not cut off
- [ ] **Images load properly**
- [ ] **Buttons are clickable** and have hover effects
- [ ] **Mobile navigation works** (hamburger menu opens/closes)
- [ ] **Bottom navigation appears** on mobile

### **Test These Buttons:**
- [ ] **"Sign In"** button
- [ ] **"Sign Up"** button  
- [ ] **"Claim R100K"** button
- [ ] **Navigation links** (Startups, Investors, Map, etc.)

---

## 🔐 **Authentication Testing**

### **Sign Up Flow:**
1. Click **"Sign Up"** button
2. Fill out the form:
   - Email: `test@example.com`
   - Password: `password123`
   - Name: `Test User`
3. Click **"Sign Up"**
4. **Expected:** Should show success message or redirect

### **Sign In Flow:**
1. Click **"Sign In"** button
2. Fill out the form:
   - Email: `test@example.com`
   - Password: `password123`
3. Click **"Sign In"**
4. **Expected:** Should redirect to dashboard

---

## 📊 **Dashboard Testing**

### **What to Check:**
- [ ] **Dashboard loads** after sign in
- [ ] **Navigation works** (all menu items clickable)
- [ ] **User profile** section displays
- [ ] **All dashboard sections** are accessible:
  - [ ] Overview
  - [ ] Discover
  - [ ] Investments
  - [ ] Messages
  - [ ] Notifications
  - [ ] Profile

---

## 🏢 **Startup Pages Testing**

### **Startups List Page:**
1. Go to `/startups` or click "Startups" in navigation
2. **Check:**
   - [ ] **Page loads** with startup listings
   - [ ] **Search bar works** (type something and see results)
   - [ ] **Filter buttons work** (if available)
   - [ ] **Startup cards are clickable**

### **Individual Startup Page:**
1. Click on any startup card
2. **Check:**
   - [ ] **Startup details load**
   - [ ] **Investment button** is visible and clickable
   - [ ] **All information displays** properly

---

## 💰 **Investment Flow Testing**

### **Investment Process:**
1. Go to a startup page
2. Click **"Invest"** or **"Investment"** button
3. **Check:**
   - [ ] **Investment modal/form opens**
   - [ ] **Amount input** works
   - [ ] **Payment options** appear (PayFast, Bank Transfer)
   - [ ] **Form validation** works (try submitting empty form)

---

## 💳 **Payment Testing**

### **Payment Options:**
1. In investment flow, select payment method
2. **Test PayFast option:**
   - [ ] **PayFast button** is clickable
   - [ ] **Redirects to payment** (or shows payment form)
3. **Test Bank Transfer option:**
   - [ ] **Bank transfer info** displays
   - [ ] **Instructions are clear**

---

## 👥 **Investor Pages Testing**

### **Investors List:**
1. Go to `/investors` or click "Investors" in navigation
2. **Check:**
   - [ ] **Investor profiles load**
   - [ ] **Search functionality** works
   - [ ] **Investor cards are clickable**

### **Individual Investor Page:**
1. Click on any investor card
2. **Check:**
   - [ ] **Investor details load**
   - [ ] **Contact/connect buttons** work
   - [ ] **All information displays** properly

---

## 🏆 **Leaderboard Testing**

1. Go to `/leaderboard` or click "Leaderboard" in navigation
2. **Check:**
   - [ ] **Leaderboard loads** with rankings
   - [ ] **Data displays** correctly
   - [ ] **Sorting/filtering** works (if available)

---

## 🗺️ **Map Testing**

1. Go to `/map` or click "Map" in navigation
2. **Check:**
   - [ ] **Map loads** (might be a placeholder)
   - [ ] **Interactive elements** work
   - [ ] **Location pins** display (if any)

---

## 📚 **Resources Testing**

1. Go to `/resources` or click "Resources" in navigation
2. **Check:**
   - [ ] **Resources page loads**
   - [ ] **All links work**
   - [ ] **Content displays** properly

---

## ⚙️ **Settings Testing**

1. Go to `/settings` or click "Settings" in navigation
2. **Check:**
   - [ ] **Settings page loads**
   - [ ] **All form inputs** work
   - [ ] **Save buttons** are functional

---

## 🔍 **Search Testing**

### **Global Search:**
1. Use the search bar (usually in header)
2. **Test:**
   - [ ] **Type something** and press Enter
   - [ ] **Search results** appear
   - [ ] **Results are clickable**

---

## 📱 **Mobile-Specific Testing**

### **Mobile Navigation:**
- [ ] **Hamburger menu** opens/closes smoothly
- [ ] **Bottom navigation** works on all pages
- [ ] **Touch targets** are large enough (44px minimum)
- [ ] **No horizontal scrolling** on any page
- [ ] **Text is readable** without zooming

### **Mobile Forms:**
- [ ] **Input fields** are easy to tap
- [ ] **Keyboard appears** when needed
- [ ] **Form submission** works on mobile

---

## 🚨 **Error Testing**

### **Test Error Scenarios:**
1. **Try invalid login:**
   - Wrong email/password
   - **Expected:** Error message appears
2. **Try invalid signup:**
   - Invalid email format
   - Weak password
   - **Expected:** Validation errors appear
3. **Test 404 pages:**
   - Go to a non-existent page like `/nonexistent`
   - **Expected:** 404 error page appears

---

## ⚡ **Performance Testing**

### **Speed Tests:**
- [ ] **Homepage loads** in under 3 seconds
- [ ] **Navigation between pages** is fast
- [ ] **Images load** quickly
- [ ] **No broken images** or missing content

### **Browser Testing:**
Test in multiple browsers:
- [ ] **Chrome**
- [ ] **Firefox** 
- [ ] **Safari** (if on Mac)
- [ ] **Edge**

---

## 📊 **Admin Dashboard Testing**

### **Admin Access:**
1. Try to go to `/admin`
2. **Expected:** Should redirect to login or show access denied
3. If you have admin access, test:
   - [ ] **Dashboard loads** with statistics
   - [ ] **All admin functions** work
   - [ ] **User management** features work

---

## 🎯 **Final Checklist**

### **Critical Functions:**
- [ ] **User registration** works
- [ ] **User login** works
- [ ] **Navigation** works on all pages
- [ ] **Mobile experience** is smooth
- [ ] **Payment flow** is accessible
- [ ] **Search functionality** works
- [ ] **All buttons** are clickable
- [ ] **Forms** submit properly
- [ ] **Error messages** appear when needed

### **User Experience:**
- [ ] **Pages load quickly**
- [ ] **Text is readable**
- [ ] **Images display properly**
- [ ] **No broken links**
- [ ] **Mobile-friendly** design
- [ ] **Professional appearance**

---

## 🚨 **If Something Doesn't Work:**

### **Common Issues:**
1. **Page won't load:** Check if development server is running
2. **Buttons don't work:** Check browser console for errors (F12)
3. **Mobile issues:** Test in different mobile viewport sizes
4. **Styling issues:** Try refreshing the page (Ctrl+F5)

### **How to Report Issues:**
1. **Take a screenshot** of the problem
2. **Note which page** you were on
3. **Describe what you tried** to do
4. **Tell me what happened** vs. what you expected

---

## 🎉 **Ready for Launch?**

Once you've tested everything and it all works smoothly, you're ready to launch! 

**Remember:** This is a comprehensive test. Take your time and test thoroughly. It's better to find issues now than after launch!

**Let me know how the testing goes!** 🚀

