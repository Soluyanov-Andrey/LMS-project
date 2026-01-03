// src/app/login/page.tsx
"use client"; // Добавь это, так как формы обычно интерактивны

import Link from 'next/link';
import styles from './login.module.css';

export default function LoginPage() {
  return (
    <main className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Вход</h1>
        <p className={styles.subtitle}>Добро пожаловать в Linear Flow</p>

        <form className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="email">Email</label>
           <input 
              className={styles.input} 
              type="email" 
              id="email" 
              placeholder="example@mail.com" 
              required 
              autoComplete="email"        // Позволяет телефону предложить сохраненные email
              inputMode="email"           // Сразу открывает клавиатуру с символом "@"
              autoCapitalize="none"       // Отключает автокапитализацию (чтобы первая буква не была заглавной)
              spellCheck="false"          // Отключает красное подчеркивание (в почте оно не нужно)
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="password">Пароль</label>
          <input 
            className={styles.input} 
            type="password" 
            id="password" 
            placeholder="••••••••" 
            required 
            autoComplete="current-password" // Важно для менеджеров паролей (FaceID/TouchID)
          />
          </div>

          <button type="button" className={styles.button}>Войти</button>
        </form>

        <div className={styles.footer}>
          Нет аккаунта? <Link href="/register" className={styles.link}>Зарегистрироваться</Link>
        </div>
      </div>
    </main>
  );
}