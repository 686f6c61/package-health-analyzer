# Package Health Analyzer - Sample Report

**Project:** my-awesome-app
**Analysis Date:** 2025-12-09
**Project Type:** commercial
**Total Dependencies:** 42

---

## Summary

| Metric | Value |
|--------|-------|
| **Total Packages** | 42 |
| **Excellent Health** | 35 (83%) |
| **Good Health** | 4 (10%) |
| **Fair Health** | 2 (5%) |
| **Poor Health** | 1 (2%) |
| **Average Score** | 87/100 |
| **Risk Level** | LOW |

### Issues Found

| Severity | Count |
|----------|-------|
| **Critical** | 0 |
| **Warning** | 3 |
| **Info** | 2 |

---

## Packages with Issues

### ⚠️ Warning Issues

#### 1. moment@2.29.4
- **Age:** 3 years 5 months (WARNING threshold exceeded)
- **Last Update:** 2022-07-06
- **License:** MIT ✓
- **Health Score:** 62/100 (Fair)
- **Recommendation:** Consider migrating to `date-fns` or native `Temporal` API
- **Estimated Effort:** 4-6 hours

**Why it matters:**
- Package hasn't been updated in over 3 years
- Known maintenance mode
- Better alternatives available

#### 2. request@2.88.2
- **Status:** DEPRECATED ⚠️
- **Age:** 5 years 8 months
- **License:** Apache-2.0 ✓
- **Health Score:** 45/100 (Poor)
- **Recommendation:** Migrate to `axios`, `got`, or native `fetch`
- **Estimated Effort:** 2-4 hours

**Why it matters:**
- Package is officially deprecated
- No security updates
- Modern alternatives are more performant

#### 3. colors@1.4.0
- **License:** MIT ✓
- **Age:** 2 years 3 months (WARNING threshold)
- **Health Score:** 71/100 (Good)
- **Note:** Consider updating to latest version (1.4.1)

### ℹ️ Info Issues

#### 4. lodash@4.17.21
- **Age:** 2 years 11 months
- **License:** MIT ✓
- **Health Score:** 78/100 (Good)
- **Recommendation:** Consider tree-shakeable alternatives like `lodash-es`
- **Note:** No critical issues, but approaching age warning threshold

#### 5. chalk@4.1.2
- **Age:** 2 years 6 months
- **License:** MIT ✓
- **Health Score:** 82/100 (Excellent)
- **Recommendation:** Upgrade to chalk@5.x for ESM support
- **Note:** Current version still maintained

---

## Top 10 Healthiest Packages

| Package | Version | Score | License | Age |
|---------|---------|-------|---------|-----|
| zod | 3.23.8 | 98/100 | MIT | 2 months |
| typescript | 5.7.2 | 97/100 | Apache-2.0 | 1 month |
| vitest | 4.0.15 | 96/100 | MIT | 3 weeks |
| commander | 12.1.0 | 95/100 | MIT | 4 months |
| chalk | 5.3.0 | 94/100 | MIT | 8 months |
| semver | 7.6.3 | 93/100 | ISC | 5 months |
| p-limit | 6.1.0 | 92/100 | MIT | 6 months |
| cli-table3 | 0.6.5 | 91/100 | MIT | 9 months |
| cosmiconfig | 9.0.0 | 90/100 | MIT | 7 months |
| prompts | 2.4.2 | 89/100 | MIT | 1 year |

---

## License Distribution

| License Type | Count | Percentage |
|--------------|-------|------------|
| MIT | 35 | 83% |
| Apache-2.0 | 4 | 10% |
| ISC | 2 | 5% |
| BSD-3-Clause | 1 | 2% |

**License Compliance:** ✅ All packages use commercial-friendly licenses

---

## Age Distribution

| Age Range | Count | Percentage |
|-----------|-------|------------|
| < 6 months | 28 | 67% |
| 6-12 months | 8 | 19% |
| 1-2 years | 3 | 7% |
| 2-3 years | 2 | 5% |
| > 3 years | 1 | 2% |

---

## Recommended Actions

### High Priority
1. **Replace `request` package** (DEPRECATED)
   - Recommended: Migrate to `axios` or native `fetch`
   - Estimated effort: 2-4 hours
   - Impact: Security and maintenance

### Medium Priority
2. **Evaluate `moment.js` migration**
   - Recommended: Consider `date-fns` or native `Temporal`
   - Estimated effort: 4-6 hours
   - Impact: Bundle size and performance

3. **Update `colors` to latest version**
   - Simple version bump
   - Estimated effort: < 1 hour
   - Impact: Bug fixes and improvements

### Low Priority
4. **Consider lodash alternatives**
   - Migrate to `lodash-es` for tree-shaking
   - Estimated effort: 2-3 hours
   - Impact: Bundle size reduction

5. **Upgrade chalk to v5.x**
   - Better ESM support
   - Estimated effort: 1-2 hours
   - Impact: Module system compatibility

---

## Detailed Package Analysis

### moment@2.29.4

**Basic Info:**
- Version: 2.29.4
- Published: 2022-07-06 (3 years 5 months ago)
- License: MIT
- Repository: https://github.com/moment/moment

**Health Score Breakdown:**
- Age: 60/100 (⚠️ Warning)
- Deprecation: 100/100 (✓)
- License: 100/100 (✓)
- Popularity: 95/100 (✓)
- Repository: 85/100 (✓)
- Update Frequency: 40/100 (⚠️)

**Overall Score:** 62/100 (Fair)

**Why the score is low:**
- Last significant update over 3 years ago
- Maintenance mode (feature freeze)
- Large bundle size (67KB minified)
- Modern alternatives available

**Migration Path:**
```javascript
// Before (moment)
import moment from 'moment';
const date = moment('2023-01-15').format('YYYY-MM-DD');

// After (date-fns)
import { format, parseISO } from 'date-fns';
const date = format(parseISO('2023-01-15'), 'yyyy-MM-dd');

// After (native Temporal - future)
const date = Temporal.PlainDate.from('2023-01-15').toString();
```

**Alternatives:**
- `date-fns` - Modular, tree-shakeable, 100+ locales
- `dayjs` - Moment.js compatible API, 2KB
- Native `Temporal` API - Future standard (Stage 3)

---

### request@2.88.2

**Basic Info:**
- Version: 2.88.2
- Published: 2020-04-21 (5 years 8 months ago)
- License: Apache-2.0
- Status: ⚠️ **DEPRECATED**
- Repository: https://github.com/request/request

**Health Score Breakdown:**
- Age: 20/100 (❌ Critical)
- Deprecation: 0/100 (❌ Deprecated)
- License: 100/100 (✓)
- Popularity: 70/100 (declining)
- Repository: 50/100 (archived)
- Update Frequency: 0/100 (❌)

**Overall Score:** 45/100 (Poor)

**Deprecation Notice:**
> "request has been deprecated, see https://github.com/request/request/issues/3142"

**Why you should migrate:**
- No security updates
- No bug fixes
- Modern alternatives with better APIs
- Potential security vulnerabilities

**Migration Path:**
```javascript
// Before (request)
const request = require('request');
request('https://api.example.com/data', (err, res, body) => {
  console.log(body);
});

// After (axios)
import axios from 'axios';
const { data } = await axios.get('https://api.example.com/data');
console.log(data);

// After (native fetch)
const response = await fetch('https://api.example.com/data');
const data = await response.json();
console.log(data);
```

**Alternatives:**
- `axios` - Promise based, interceptors, automatic transforms
- `got` - Lightweight, stream support, retry logic
- Native `fetch` - Built-in, no dependencies (Node.js 18+)

---

## Configuration Used

```json
{
  "projectType": "commercial",
  "age": {
    "warn": "2y",
    "critical": "5y"
  },
  "license": {
    "deny": ["GPL-*", "AGPL-*"],
    "warn": ["LGPL-*"]
  },
  "scoring": {
    "minimumScore": 60
  },
  "failOn": "critical"
}
```

---

## Conclusion

Your project has **good overall health** with an average score of **87/100**. Most dependencies are well-maintained and use commercial-friendly licenses.

**Key takeaways:**
- ✅ No critical issues found
- ⚠️ 3 warnings need attention
- 📦 1 deprecated package requires immediate action
- 🎯 Focus on replacing `request` first

**Next steps:**
1. Run `npm outdated` to check for available updates
2. Create a migration plan for deprecated packages
3. Set up automated dependency monitoring
4. Schedule regular dependency health checks

---

*Generated by [package-health-analyzer](https://package-health-analyzer.onrender.com) v1.0.0*
