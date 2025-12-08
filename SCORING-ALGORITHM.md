# Health Scoring Algorithm

Complete documentation of the 0-100 health score calculation system.

---

## Overview

Each package receives a **health score from 0-100** based on 7 weighted dimensions:

1. **Age** - How recently the package was updated
2. **Deprecation** - Official deprecation status
3. **License** - License compatibility and quality
4. **Vulnerability** - Known security issues
5. **Popularity** - Download statistics and trends
6. **Repository** - GitHub activity and health
7. **Update Frequency** - Maintenance consistency

---

## Formula

```
Overall Score = Σ (Dimension Score × Booster Weight) / Σ (Booster Weights)
```

Each dimension is scored 0-100, then multiplied by its booster weight.

### Default Booster Weights

```json
{
  "age": 1.5,
  "deprecation": 4.0,
  "license": 3.0,
  "vulnerability": 2.0,
  "popularity": 1.0,
  "repository": 2.0,
  "updateFrequency": 1.5
}
```

**Total weight sum:** 15.0 (default)

---

## Dimension Calculations

### 1. Age Score

**Formula:**
```
if deprecated: score = 0
else if ageDays < 180 (6 months): score = 100
else if ageDays < 365 (1 year): score = 90
else if ageDays < 730 (2 years): score = 80
else if ageDays < 1095 (3 years): score = 60
else if ageDays < 1825 (5 years): score = 40
else: score = 20
```

**Thresholds:**
- < 6 months → 100 (Perfect)
- < 1 year → 90 (Excellent)
- < 2 years → 80 (Good)
- < 3 years → 60 (Fair)
- < 5 years → 40 (Poor)
- ≥ 5 years → 20 (Critical)

**Booster:** 1.5x (moderate importance)

---

### 2. Deprecation Score

**Formula:**
```
if deprecated: score = 0
else: score = 100
```

Binary: either perfect or fail.

**Booster:** 4.0x (highest importance - deprecated packages are critical risk)

---

### 3. License Score

**Formula:**
```
if category === 'commercial-friendly': score = 100
else if category === 'commercial-warning': score = 70
else if category === 'commercial-incompatible': score = 30
else if category === 'unknown': score = 50
else: score = 0 (unlicensed)

// Blue Oak bonus
if blueOakRating === 'gold': score += 0
else if blueOakRating === 'silver': score -= 5
else if blueOakRating === 'bronze': score -= 10
else if blueOakRating === 'lead': score -= 20

// Patent clause bonus
if hasPatentClause: score += 5

// Cap at 100
score = Math.min(100, score)
```

**Categories:**
- **Commercial-friendly** (MIT, Apache-2.0, etc.) → 100
- **Commercial-warning** (LGPL, MPL, etc.) → 70
- **Commercial-incompatible** (GPL, AGPL) → 30
- **Unknown** → 50
- **Unlicensed** → 0

**Blue Oak Rating impact:**
- Gold → No penalty
- Silver → -5 points
- Bronze → -10 points
- Lead → -20 points

**Patent clause:** +5 points (Apache-2.0, EPL)

**Booster:** 3.0x (high importance for commercial projects)

---

### 4. Vulnerability Score

**Formula:**
```
if hasKnownVulnerabilities:
  score = 100 - (criticalCount × 30) - (highCount × 15) - (mediumCount × 5)
else:
  score = 100

score = Math.max(0, score)
```

**Penalty per vulnerability:**
- Critical → -30 points
- High → -15 points
- Medium → -5 points
- Low → -1 point

**Example:**
- 1 critical + 2 high = 100 - 30 - 30 = **40 score**
- 0 vulnerabilities = **100 score**

**Booster:** 2.0x (important for security)

---

### 5. Popularity Score

**Formula:**
```
// Based on weekly downloads
if downloads >= 10000000: score = 100  // 10M+
else if downloads >= 1000000: score = 95  // 1M-10M
else if downloads >= 100000: score = 85   // 100K-1M
else if downloads >= 10000: score = 70    // 10K-100K
else if downloads >= 1000: score = 50     // 1K-10K
else: score = 30                          // < 1K

// Trend adjustment
if trend === 'growing': score += 5
else if trend === 'declining': score -= 10

score = Math.min(100, Math.max(0, score))
```

**Download thresholds:**
- ≥ 10M/week → 100
- ≥ 1M/week → 95
- ≥ 100K/week → 85
- ≥ 10K/week → 70
- ≥ 1K/week → 50
- < 1K/week → 30

**Trend impact:**
- Growing → +5
- Declining → -10

**Booster:** 1.0x (informational, least important)

---

### 6. Repository Score

**Formula:**
```
if no repository: score = 50

// Base score from GitHub metrics
if archived: score = 0
else:
  score = 100

  // Stars penalty
  if stars < 10: score -= 20
  else if stars < 100: score -= 10

  // Open issues penalty
  if openIssues > 500: score -= 20
  else if openIssues > 100: score -= 10

  // Last commit age penalty
  if lastCommit > 365 days: score -= 30
  else if lastCommit > 180 days: score -= 15

  // Activity bonus
  if lastCommit < 30 days: score += 5

score = Math.max(0, score)
```

**Penalties:**
- Archived → 0 (instant fail)
- < 10 stars → -20
- < 100 stars → -10
- > 500 open issues → -20
- > 100 open issues → -10
- Last commit > 1 year → -30
- Last commit > 6 months → -15

**Bonus:**
- Last commit < 30 days → +5

**Booster:** 2.0x (important indicator of maintenance)

---

### 7. Update Frequency Score

**Formula:**
```
// Calculate average days between releases (last 12 months)
if avgDaysBetweenReleases <= 30: score = 100    // Monthly+
else if avgDaysBetweenReleases <= 90: score = 90    // Quarterly
else if avgDaysBetweenReleases <= 180: score = 70   // Semi-annual
else if avgDaysBetweenReleases <= 365: score = 50   // Annual
else: score = 30                                     // Rare

// Zero releases penalty
if releaseCount === 0: score = 20

// Very active bonus
if releaseCount > 20: score += 10

score = Math.min(100, score)
```

**Frequency thresholds:**
- ≤ 30 days (monthly+) → 100
- ≤ 90 days (quarterly) → 90
- ≤ 180 days (semi-annual) → 70
- ≤ 365 days (annual) → 50
- > 365 days (rare) → 30

**Adjustments:**
- 0 releases → 20
- > 20 releases/year → +10

**Booster:** 1.5x (moderate importance)

---

## Rating Categories

Final score is mapped to a rating:

```typescript
if (score >= 90): rating = 'excellent'
else if (score >= 75): rating = 'good'
else if (score >= 60): rating = 'fair'
else: rating = 'poor'
```

| Score Range | Rating | Description |
|-------------|--------|-------------|
| 90-100 | **Excellent** | Well-maintained, safe, recommended |
| 75-89 | **Good** | Solid choice, minor concerns |
| 60-74 | **Fair** | Acceptable but needs monitoring |
| 0-59 | **Poor** | High risk, consider alternatives |

---

## Customizing Boosters

You can adjust booster weights to match your priorities:

### Security-Focused

Emphasize vulnerabilities and deprecation:

```json
{
  "scoring": {
    "boosters": {
      "age": 1.0,
      "deprecation": 5.0,
      "license": 2.0,
      "vulnerability": 4.0,
      "popularity": 0.5,
      "repository": 1.5,
      "updateFrequency": 1.0
    }
  }
}
```

### License-Focused

Emphasize legal compliance:

```json
{
  "scoring": {
    "boosters": {
      "age": 1.0,
      "deprecation": 3.0,
      "license": 5.0,
      "vulnerability": 2.0,
      "popularity": 0.5,
      "repository": 1.5,
      "updateFrequency": 1.0
    }
  }
}
```

### Stability-Focused

Emphasize maturity and popularity:

```json
{
  "scoring": {
    "boosters": {
      "age": 0.5,
      "deprecation": 4.0,
      "license": 2.0,
      "vulnerability": 2.0,
      "popularity": 3.0,
      "repository": 2.5,
      "updateFrequency": 1.0
    }
  }
}
```

---

## Example Calculation

Let's calculate the score for `moment@2.29.4`:

**Dimension Scores:**
- Age: 60/100 (3+ years old)
- Deprecation: 100/100 (not deprecated)
- License: 100/100 (MIT)
- Vulnerability: 85/100 (1 medium issue)
- Popularity: 95/100 (15M downloads/week)
- Repository: 85/100 (47K stars, but inactive)
- Update Frequency: 40/100 (no updates in 3 years)

**Weighted Calculation:**
```
(60 × 1.5) + (100 × 4.0) + (100 × 3.0) + (85 × 2.0) + (95 × 1.0) + (85 × 2.0) + (40 × 1.5)
= 90 + 400 + 300 + 170 + 95 + 170 + 60
= 1285

Total weight = 1.5 + 4.0 + 3.0 + 2.0 + 1.0 + 2.0 + 1.5 = 15.0

Overall Score = 1285 / 15.0 = 85.67 → 86/100
```

**Rating:** Good (75-89)

---

## Minimum Score Enforcement

Set a minimum acceptable score:

```json
{
  "scoring": {
    "minimumScore": 70
  }
}
```

Packages below this threshold will:
- Be flagged in reports
- Fail the build (if `failOn` is configured)
- Get high-priority recommendations

---

## Disabling Scoring

To disable scoring entirely:

```json
{
  "scoring": {
    "enabled": false
  }
}
```

Analysis will still run, but scores won't be calculated.

---

## Tips for Optimization

1. **Start with defaults** - They work for most projects
2. **Boost critical dimensions** - Increase weights for your priorities
3. **Set minimumScore gradually** - Start at 50, increase over time
4. **Monitor score distribution** - Aim for 80+ average
5. **Use scores for prioritization** - Fix lowest scores first

---

## Score Distribution Guidelines

**Healthy project:**
- 70%+ packages with score ≥ 80
- < 10% packages with score < 60
- Average score ≥ 80

**Needs attention:**
- 50-70% packages with score ≥ 80
- 10-20% packages with score < 60
- Average score 70-80

**Critical issues:**
- < 50% packages with score ≥ 80
- > 20% packages with score < 60
- Average score < 70

---

**Algorithm Version:** 1.0.0
**Last updated:** 2025-12-09
