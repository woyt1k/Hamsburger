import { supabase } from "@/services/supabase";  // Именованный импорт
import { useTelegram } from '@/services/telegram';
import { useScoreStore } from "@/stores/score";

const { user } = useTelegram();

const MY_ID = user?.id ?? 4253;

export async function fetchTasks() {
  const { data } = await supabase.from('tasks').select('*');
  return data;
}

export async function getOrCreateUser() {
  const potentialUser = await supabase
    .from('users')
    .select()
    .eq('telegram', MY_ID)

  if (potentialUser.data.length !== 0) {
    return potentialUser.data[0];
  }

  const newUser = {
    telegram: MY_ID,
    friends: {},
    tasks: {},
    score: 0,
  };

  await supabase.from('users').insert(newUser);
  return newUser
}

export async function updateScore(score) {
  await supabase.from('users').update({ score }).eq('telegram', MY_ID);
}


export async function registerRef(userName, refId) {
  const { data, error } = await supabase.from('users').select('friends, score').eq('telegram', +refId).single();

  if (error || !data) {
    console.error('Ошибка при получении пользователя:', error?.message || 'Пользователь не найден');
    return;
  }

  const updatedFriends = { ...data.friends, [MY_ID]: userName };

  // Обновляем друзей и добавляем очки
  const { error: updateError } = await supabase.from('users').update({
    friends: updatedFriends,
    score: data.score + 50,
  }).eq('telegram', +refId);

  if (updateError) {
    console.error('Ошибка обновления друзей:', updateError.message);
  } else {
    console.log('Друг успешно добавлен:', updatedFriends);
  }
}




export async function completeTask(user, task) {
  const score = useScoreStore();
  console.log("Текущий счёт из локального состояния:", score.score);

  // Проверка на наличие необходимых данных
  if (!user?.telegram || !task?.id || task.amount == null) {
    console.error("Ошибка: отсутствуют обязательные параметры.");
    return;
  }

  try {
    // Получаем текущий счет пользователя из базы данных
    const { data: userData, error: fetchError } = await supabase
      .from('users')
      .select('score, tasks')
      .eq('telegram', user.telegram)
      .single();

    if (fetchError) {
      throw new Error(`Ошибка при получении данных пользователя: ${fetchError.message}`);
    }

    const currentScore = userData?.score ?? 0;
    const taskAmount = task.amount ?? 0;

    // Проверяем, не выполнена ли задача ранее
    const taskAlreadyCompleted = userData?.tasks?.[task.id];
    if (taskAlreadyCompleted) {
      console.log("Задача уже была выполнена ранее, очки не начисляются.");
      return;
    }

    const newScore = currentScore + taskAmount;

    if (isNaN(newScore)) {
      throw new Error("Ошибка: newScore - не число!");
    }

    const updatedTasks = { ...userData.tasks, [task.id]: true };

    // Обновляем данные в базе данных
    const { error: updateError } = await supabase
      .from('users')
      .update({
        tasks: updatedTasks,
        score: newScore
      })
      .eq('telegram', user.telegram);

    if (updateError) {
      throw new Error(`Ошибка обновления задачи: ${updateError.message}`);
    }

    // Обновляем локальное состояние
    score.setScore(newScore);
    console.log("Очки успешно обновлены в базе и локальном состоянии:", newScore);
  } catch (error) {
    console.error(error.message);
  }
}
