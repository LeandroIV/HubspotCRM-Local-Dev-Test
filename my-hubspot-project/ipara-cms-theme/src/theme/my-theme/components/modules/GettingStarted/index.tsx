import { ModuleFields, TextField } from '@hubspot/cms-components/fields';
import styles from '../../../styles/getting-started.module.css';

export function Component({ fieldValues }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.badge}>Open Source Project</div>

      <h1 className={styles.title}>
        Welcome to <span>iPara</span>
      </h1>

      <p className={styles.subtitle}>
        {fieldValues.subtitle}
      </p>

      <div className={styles.buttons}>
        <a
          className={styles.btnPrimary}
          href="https://github.com/LeandroIV/iPara"
          target="_blank"
          rel="noopener noreferrer"
        >
          View on GitHub
        </a>
        <a
          className={styles.btnSecondary}
          href="https://github.com/LeandroIV/iPara#readme"
          target="_blank"
          rel="noopener noreferrer"
        >
          Read the Docs
        </a>
      </div>

      <p className={styles.footer}>
        Built by Leandro IV &mdash; github.com/LeandroIV/iPara
      </p>
    </div>
  );
}

export const fields = (
  <ModuleFields>
    <TextField
      name="subtitle"
      label="Subtitle"
      default="A modern project by LeandroIV. Explore the source code, contribute, and get started today."
    />
  </ModuleFields>
);

export const meta = {
  label: 'iPara Landing Page',
};
