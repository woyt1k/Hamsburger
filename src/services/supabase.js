import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://trbqcqhpgjwtktnreexf.supabase.co';
const SUPABASE_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRyYnFjcWhwZ2p3dGt0bnJlZXhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUzODM0ODQsImV4cCI6MjA1MDk1OTQ4NH0._bqX0TQJaZdyn9hBXEPwuyJpm5fJZPLCdvunNZHkv-I'; // Для безопасности рекомендуется не хранить ключи в коде

const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY);

export default supabase;
export { supabase };


export async function getUserScore(telegram) {
  const { data, error } = await supabase
    .from('users') // Используй правильное имя таблицы
    .select('score')
    .eq('telegram', telegram)
    .single(); // Ожидаем одну запись

  if (error) {
    console.error('Ошибка получения очков пользователя:', error.message);
    return null;
  }

  return data;
}

// Функция для добавления или обновления очков пользователя
export async function addOrUpdateUserScore(telegram, score) {
  const { data, error } = await supabase
    .from('users')
    .upsert({ telegram, score }, { onConflict: 'telegram' })
    .select();

  if (error) {
    console.error('Ошибка обновления очков пользователя:', error.message);
    return null;
  }

  return data;
}
