import { describe, it, expect } from 'vitest';
import {
  allSPDXLicenses,
  licensesWithPatentClauses,
  spdxExceptions,
  hasPatentClause,
  getLicenseInfo,
  isOSIApproved,
  isFSFLibre,
  type SPDXLicense,
} from '../../src/utils/spdx-licenses.js';

describe('SPDX Licenses Database', () => {
  describe('Database completeness', () => {
    it('should contain 214 SPDX licenses', () => {
      expect(allSPDXLicenses).toHaveLength(214);
    });

    it('should have 30 licenses with patent clauses', () => {
      expect(licensesWithPatentClauses.size).toBe(30);
    });

    it('should have 9 SPDX exceptions', () => {
      expect(spdxExceptions).toHaveLength(9);
    });

    it('all licenses should have required fields', () => {
      allSPDXLicenses.forEach(license => {
        expect(license).toHaveProperty('id');
        expect(license).toHaveProperty('name');
        expect(typeof license.id).toBe('string');
        expect(typeof license.name).toBe('string');
        expect(license.id.length).toBeGreaterThan(0);
        expect(license.name.length).toBeGreaterThan(0);
      });
    });

    it('all license IDs should be unique', () => {
      const ids = allSPDXLicenses.map(l => l.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(allSPDXLicenses.length);
    });

    it('all SPDX exceptions should be strings', () => {
      spdxExceptions.forEach(exception => {
        expect(typeof exception).toBe('string');
        expect(exception.length).toBeGreaterThan(0);
      });
    });
  });

  describe('hasPatentClause()', () => {
    it('should detect Apache-2.0 has patent clause', () => {
      expect(hasPatentClause('Apache-2.0')).toBe(true);
    });

    it('should detect Apache-1.1 has patent clause', () => {
      expect(hasPatentClause('Apache-1.1')).toBe(true);
    });

    it('should detect MPL-2.0 has patent clause', () => {
      expect(hasPatentClause('MPL-2.0')).toBe(true);
    });

    it('should detect EPL-1.0 has patent clause', () => {
      expect(hasPatentClause('EPL-1.0')).toBe(true);
    });

    it('should detect EPL-2.0 has patent clause', () => {
      expect(hasPatentClause('EPL-2.0')).toBe(true);
    });

    it('should detect GPL-3.0-only has patent clause', () => {
      expect(hasPatentClause('GPL-3.0-only')).toBe(true);
    });

    it('should detect GPL-3.0-or-later has patent clause', () => {
      expect(hasPatentClause('GPL-3.0-or-later')).toBe(true);
    });

    it('should detect AFL-3.0 has patent clause', () => {
      expect(hasPatentClause('AFL-3.0')).toBe(true);
    });

    it('should detect OSL-3.0 has patent clause', () => {
      expect(hasPatentClause('OSL-3.0')).toBe(true);
    });

    it('should detect MS-PL has patent clause', () => {
      expect(hasPatentClause('MS-PL')).toBe(true);
    });

    it('should detect MIT does NOT have patent clause', () => {
      expect(hasPatentClause('MIT')).toBe(false);
    });

    it('should detect BSD-3-Clause does NOT have patent clause', () => {
      expect(hasPatentClause('BSD-3-Clause')).toBe(false);
    });

    it('should detect ISC does NOT have patent clause', () => {
      expect(hasPatentClause('ISC')).toBe(false);
    });

    it('should detect GPL-2.0-only does NOT have patent clause', () => {
      expect(hasPatentClause('GPL-2.0-only')).toBe(false);
    });

    it('should detect unknown license does NOT have patent clause', () => {
      expect(hasPatentClause('Unknown-License-1.0')).toBe(false);
    });

    it('should verify all 30 patent clause licenses are in database', () => {
      const expectedPatentLicenses = [
        'AFL-1.1', 'AFL-1.2', 'AFL-2.0', 'AFL-2.1', 'AFL-3.0',
        'Apache-1.1', 'Apache-2.0',
        'APL-1.0',
        'APSL-1.0', 'APSL-1.1', 'APSL-1.2', 'APSL-2.0',
        'CATOSL-1.1',
        'CDDL-1.0', 'CDDL-1.1',
        'CPL-1.0',
        'EPL-1.0', 'EPL-2.0',
        'EUPL-1.0', 'EUPL-1.1', 'EUPL-1.2',
        'GPL-3.0', 'GPL-3.0-only', 'GPL-3.0-or-later',
        'IPL-1.0',
        'MPL-2.0',
        'MS-PL',
        'OSL-3.0',
        'PHP-3.01',
        'SPL-1.0',
      ];

      expectedPatentLicenses.forEach(licenseId => {
        expect(hasPatentClause(licenseId)).toBe(true);
      });
    });
  });

  describe('getLicenseInfo()', () => {
    it('should return MIT license info', () => {
      const info = getLicenseInfo('MIT');
      expect(info).toBeDefined();
      expect(info?.id).toBe('MIT');
      expect(info?.name).toContain('MIT');
      expect(info?.osiApproved).toBe(true);
      expect(info?.fsfLibre).toBe(true);
    });

    it('should return Apache-2.0 license info', () => {
      const info = getLicenseInfo('Apache-2.0');
      expect(info).toBeDefined();
      expect(info?.id).toBe('Apache-2.0');
      expect(info?.osiApproved).toBe(true);
      expect(info?.fsfLibre).toBe(true);
      expect(info?.hasPatentClause).toBe(true);
    });

    it('should return BSD-3-Clause license info', () => {
      const info = getLicenseInfo('BSD-3-Clause');
      expect(info).toBeDefined();
      expect(info?.id).toBe('BSD-3-Clause');
      expect(info?.osiApproved).toBe(true);
      expect(info?.fsfLibre).toBe(true);
    });

    it('should return GPL-3.0-only license info', () => {
      const info = getLicenseInfo('GPL-3.0-only');
      expect(info).toBeDefined();
      expect(info?.id).toBe('GPL-3.0-only');
      expect(info?.osiApproved).toBe(true);
      expect(info?.fsfLibre).toBe(true);
      expect(info?.hasPatentClause).toBe(true);
    });

    it('should return ISC license info', () => {
      const info = getLicenseInfo('ISC');
      expect(info).toBeDefined();
      expect(info?.id).toBe('ISC');
      expect(info?.osiApproved).toBe(true);
      expect(info?.fsfLibre).toBe(true);
    });

    it('should return undefined for unknown license', () => {
      const info = getLicenseInfo('Unknown-License-99.99');
      expect(info).toBeUndefined();
    });

    it('should return info for all 221 licenses', () => {
      allSPDXLicenses.forEach(license => {
        const info = getLicenseInfo(license.id);
        expect(info).toBeDefined();
        expect(info?.id).toBe(license.id);
      });
    });

    it('should handle deprecated GPL-3.0', () => {
      const info = getLicenseInfo('GPL-3.0');
      expect(info).toBeDefined();
      expect(info?.deprecated).toBe(true);
    });
  });

  describe('isOSIApproved()', () => {
    it('should detect MIT is OSI approved', () => {
      expect(isOSIApproved('MIT')).toBe(true);
    });

    it('should detect Apache-2.0 is OSI approved', () => {
      expect(isOSIApproved('Apache-2.0')).toBe(true);
    });

    it('should detect BSD-3-Clause is OSI approved', () => {
      expect(isOSIApproved('BSD-3-Clause')).toBe(true);
    });

    it('should detect GPL-2.0-only is OSI approved', () => {
      expect(isOSIApproved('GPL-2.0-only')).toBe(true);
    });

    it('should detect ISC is OSI approved', () => {
      expect(isOSIApproved('ISC')).toBe(true);
    });

    it('should detect JSON license is NOT OSI approved', () => {
      const info = getLicenseInfo('JSON');
      if (info) {
        expect(isOSIApproved('JSON')).toBe(false);
      }
    });

    it('should return false for unknown license', () => {
      expect(isOSIApproved('Unknown-License-1.0')).toBe(false);
    });

    it('should detect MPL-2.0 is OSI approved', () => {
      expect(isOSIApproved('MPL-2.0')).toBe(true);
    });

    it('should detect EPL-2.0 is OSI approved', () => {
      expect(isOSIApproved('EPL-2.0')).toBe(true);
    });
  });

  describe('isFSFLibre()', () => {
    it('should detect MIT is FSF Libre', () => {
      expect(isFSFLibre('MIT')).toBe(true);
    });

    it('should detect Apache-2.0 is FSF Libre', () => {
      expect(isFSFLibre('Apache-2.0')).toBe(true);
    });

    it('should detect GPL-3.0-only is FSF Libre', () => {
      expect(isFSFLibre('GPL-3.0-only')).toBe(true);
    });

    it('should detect BSD-3-Clause is FSF Libre', () => {
      expect(isFSFLibre('BSD-3-Clause')).toBe(true);
    });

    it('should detect ISC is FSF Libre', () => {
      expect(isFSFLibre('ISC')).toBe(true);
    });

    it('should return false for unknown license', () => {
      expect(isFSFLibre('Unknown-License-1.0')).toBe(false);
    });

    it('should detect MPL-2.0 is FSF Libre', () => {
      expect(isFSFLibre('MPL-2.0')).toBe(true);
    });

    it('should detect EPL-2.0 is FSF Libre', () => {
      expect(isFSFLibre('EPL-2.0')).toBe(true);
    });
  });

  describe('SPDX Exceptions', () => {
    it('should include Classpath-exception-2.0', () => {
      expect(spdxExceptions).toContain('Classpath-exception-2.0');
    });

    it('should include LLVM-exception', () => {
      expect(spdxExceptions).toContain('LLVM-exception');
    });

    it('should include GCC-exception-3.1', () => {
      expect(spdxExceptions).toContain('GCC-exception-3.1');
    });

    it('should include Qt-LGPL-exception-1.1', () => {
      expect(spdxExceptions).toContain('Qt-LGPL-exception-1.1');
    });

    it('should include Font-exception-2.0', () => {
      expect(spdxExceptions).toContain('Font-exception-2.0');
    });

    it('all exceptions should be unique', () => {
      const uniqueExceptions = new Set(spdxExceptions);
      expect(uniqueExceptions.size).toBe(spdxExceptions.length);
    });
  });

  describe('License metadata accuracy', () => {
    it('should have correct OSI/FSF status for common licenses', () => {
      const expectations: Array<{
        id: string;
        osiApproved: boolean;
        fsfLibre: boolean;
      }> = [
        { id: 'MIT', osiApproved: true, fsfLibre: true },
        { id: 'Apache-2.0', osiApproved: true, fsfLibre: true },
        { id: 'BSD-3-Clause', osiApproved: true, fsfLibre: true },
        { id: 'BSD-2-Clause', osiApproved: true, fsfLibre: true },
        { id: 'GPL-2.0-only', osiApproved: true, fsfLibre: true },
        { id: 'GPL-3.0-only', osiApproved: true, fsfLibre: true },
        { id: 'LGPL-2.1-only', osiApproved: true, fsfLibre: true },
        { id: 'LGPL-3.0-only', osiApproved: true, fsfLibre: true },
        { id: 'ISC', osiApproved: true, fsfLibre: true },
        { id: 'MPL-2.0', osiApproved: true, fsfLibre: true },
      ];

      expectations.forEach(({ id, osiApproved, fsfLibre }) => {
        const info = getLicenseInfo(id);
        expect(info).toBeDefined();
        expect(info?.osiApproved).toBe(osiApproved);
        expect(info?.fsfLibre).toBe(fsfLibre);
      });
    });

    it('should have correct patent clause status for common licenses', () => {
      const withPatent = ['Apache-2.0', 'MPL-2.0', 'GPL-3.0-only', 'EPL-2.0'];
      const withoutPatent = ['MIT', 'BSD-3-Clause', 'ISC', 'GPL-2.0-only'];

      withPatent.forEach(id => {
        const info = getLicenseInfo(id);
        expect(info?.hasPatentClause).toBe(true);
      });

      withoutPatent.forEach(id => {
        const info = getLicenseInfo(id);
        expect(info?.hasPatentClause).not.toBe(true);
      });
    });

    it('should mark deprecated licenses correctly', () => {
      const deprecated = ['GPL-1.0', 'GPL-2.0', 'GPL-3.0', 'LGPL-2.0', 'LGPL-2.1', 'LGPL-3.0'];

      deprecated.forEach(id => {
        const info = getLicenseInfo(id);
        if (info) {
          expect(info.deprecated).toBe(true);
        }
      });
    });

    it('should have consistent metadata across all licenses', () => {
      // Ensure no license has undefined values for boolean fields where defined
      allSPDXLicenses.forEach(license => {
        if (license.osiApproved !== undefined) {
          expect(typeof license.osiApproved).toBe('boolean');
        }
        if (license.fsfLibre !== undefined) {
          expect(typeof license.fsfLibre).toBe('boolean');
        }
        if (license.deprecated !== undefined) {
          expect(typeof license.deprecated).toBe('boolean');
        }
        if (license.hasPatentClause !== undefined) {
          expect(typeof license.hasPatentClause).toBe('boolean');
        }
      });
    });
  });

  describe('Modern license support', () => {
    it('should include Elastic-2.0', () => {
      const info = getLicenseInfo('Elastic-2.0');
      expect(info).toBeDefined();
      expect(info?.id).toBe('Elastic-2.0');
    });

    it('should include BUSL-1.1', () => {
      const info = getLicenseInfo('BUSL-1.1');
      expect(info).toBeDefined();
      expect(info?.id).toBe('BUSL-1.1');
    });

    it('should include PolyForm licenses', () => {
      const polyformLicenses = allSPDXLicenses.filter(l => l.id.startsWith('PolyForm'));
      expect(polyformLicenses.length).toBeGreaterThan(0);
    });
  });

  describe('Edge cases', () => {
    it('should handle empty string license ID', () => {
      const info = getLicenseInfo('');
      expect(info).toBeUndefined();
    });

    it('should handle case sensitivity', () => {
      // SPDX IDs are case-sensitive
      const info = getLicenseInfo('mit');
      expect(info).toBeUndefined();
    });

    it('should not confuse similar license IDs', () => {
      const gpl2 = getLicenseInfo('GPL-2.0-only');
      const gpl3 = getLicenseInfo('GPL-3.0-only');

      expect(gpl2?.id).toBe('GPL-2.0-only');
      expect(gpl3?.id).toBe('GPL-3.0-only');
      expect(gpl2?.hasPatentClause).not.toBe(true);
      expect(gpl3?.hasPatentClause).toBe(true);
    });

    it('should differentiate -only and -or-later licenses', () => {
      const only = getLicenseInfo('GPL-3.0-only');
      const orLater = getLicenseInfo('GPL-3.0-or-later');

      expect(only?.id).toBe('GPL-3.0-only');
      expect(orLater?.id).toBe('GPL-3.0-or-later');
    });
  });

  describe('Performance', () => {
    it('hasPatentClause should be fast (Set lookup)', () => {
      const start = performance.now();
      for (let i = 0; i < 10000; i++) {
        hasPatentClause('Apache-2.0');
        hasPatentClause('MIT');
      }
      const duration = performance.now() - start;
      expect(duration).toBeLessThan(100); // Should be very fast
    });

    it('getLicenseInfo should be reasonably fast', () => {
      const start = performance.now();
      for (let i = 0; i < 1000; i++) {
        getLicenseInfo('MIT');
        getLicenseInfo('Apache-2.0');
        getLicenseInfo('Unknown-License');
      }
      const duration = performance.now() - start;
      expect(duration).toBeLessThan(500); // Array lookup, should still be fast
    });
  });
});
