import { personalInfo, experience, leadership, resumeModes, projects } from './portfolioData';

const VALID_MODES = ['AI/ML', 'Fullstack', 'Gamedev'];
const VALID_STATUSES = ['Shipped', 'In Progress', 'Ongoing'];

describe('personalInfo', () => {
  test('has name, email, location', () => {
    expect(personalInfo.name).toBeTruthy();
    expect(personalInfo.email).toMatch(/@/);
    expect(personalInfo.location).toBeTruthy();
  });

  test('has valid linkedin and github URLs', () => {
    expect(personalInfo.linkedin).toMatch(/^https:\/\//);
    expect(personalInfo.github).toMatch(/^https:\/\//);
  });

  test('education has required fields', () => {
    const { education } = personalInfo;
    expect(education.school).toBeTruthy();
    expect(education.degree).toBeTruthy();
    expect(education.gpa).toBeTruthy();
    expect(education.expected).toBeTruthy();
    expect(education.coursework.length).toBeGreaterThan(0);
  });

  test('has hobbies and languages', () => {
    expect(personalInfo.hobbies.length).toBeGreaterThan(0);
    expect(personalInfo.languages.length).toBeGreaterThan(0);
  });
});

describe('resumeModes', () => {
  test('defines all three modes', () => {
    VALID_MODES.forEach(m => expect(resumeModes[m]).toBeDefined());
  });

  VALID_MODES.forEach(mode => {
    describe(`${mode}`, () => {
      test('has title, subtitle, flavor, and background', () => {
        const m = resumeModes[mode];
        expect(m.title).toBeTruthy();
        expect(m.subtitle).toBeTruthy();
        expect(m.flavor).toBeTruthy();
        expect(m.background).toBeTruthy();
      });

      test('has exactly 6 stats', () => {
        expect(resumeModes[mode].stats).toHaveLength(6);
      });

      test('each stat has name, label, and a score in [1, 20]', () => {
        resumeModes[mode].stats.forEach(stat => {
          expect(stat.name).toBeTruthy();
          expect(stat.label).toBeTruthy();
          expect(stat.score).toBeGreaterThanOrEqual(1);
          expect(stat.score).toBeLessThanOrEqual(20);
        });
      });

      test('has a non-empty skills list', () => {
        expect(resumeModes[mode].skills.length).toBeGreaterThan(0);
      });
    });
  });
});

describe('projects', () => {
  test('has at least one project', () => {
    expect(projects.length).toBeGreaterThan(0);
  });

  projects.forEach((project, i) => {
    describe(`projects[${i}]: "${project.name}"`, () => {
      test('has required fields', () => {
        expect(project.name).toBeTruthy();
        expect(project.status).toBeTruthy();
        expect(project.description).toBeTruthy();
        expect(Array.isArray(project.bullets)).toBe(true);
        expect(Array.isArray(project.tech)).toBe(true);
        expect(Array.isArray(project.modes)).toBe(true);
      });

      test('status is valid', () => {
        expect(VALID_STATUSES).toContain(project.status);
      });

      test('all mode tags are valid', () => {
        project.modes.forEach(m => expect(VALID_MODES).toContain(m));
      });

      test('has at least one bullet', () => {
        expect(project.bullets.length).toBeGreaterThan(0);
      });

      test('url is null or a valid https URL', () => {
        if (project.url !== null) {
          expect(project.url).toMatch(/^https:\/\//);
        }
      });
    });
  });
});

describe('experience', () => {
  test('has experience entries', () => {
    expect(experience.length).toBeGreaterThan(0);
  });

  experience.forEach((exp, i) => {
    test(`experience[${i}] has required fields and valid modes`, () => {
      expect(exp.role).toBeTruthy();
      expect(exp.org).toBeTruthy();
      expect(exp.dates).toBeTruthy();
      expect(exp.bullets.length).toBeGreaterThan(0);
      exp.modes.forEach(m => expect(VALID_MODES).toContain(m));
    });
  });
});

describe('leadership', () => {
  test('has leadership entries', () => {
    expect(leadership.length).toBeGreaterThan(0);
  });

  leadership.forEach((item, i) => {
    test(`leadership[${i}] has required fields`, () => {
      expect(item.role).toBeTruthy();
      expect(item.org).toBeTruthy();
      expect(item.dates).toBeTruthy();
      expect(item.bullets.length).toBeGreaterThan(0);
    });
  });
});

describe('project mode filtering', () => {
  VALID_MODES.forEach(mode => {
    test(`at least one project is tagged for ${mode}`, () => {
      const filtered = projects.filter(p => p.modes.includes(mode));
      expect(filtered.length).toBeGreaterThan(0);
    });
  });
});
