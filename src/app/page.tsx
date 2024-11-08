// 메인페이지

'use client';

import Bar from '@/component/bar';
import Button from '@/component/button';
import SmallButton from '@/component/small-button';
import List from '@/component/list';
import { useEffect, useState } from 'react';

interface Todo {
  id: number;
  name: string;
  isCompleted: boolean;
  imageUrl: string;
  memo: string;
  tenantId: string;
}

export default function Home() {
  const userId = 'thbr'; // 이건 유저마다 다름

  const [newTodo, setNewTodo] = useState<Todo>({
    id: 0,
    imageUrl: '',
    isCompleted: false,
    memo: '',
    name: '',
    tenantId: '',
  });
  const [todos, setTodos] = useState<Todo[]>([]);
  const [dones, setDones] = useState<Todo[]>([]);

  // 할 일 목록 get요청
  const getTodos = async () => {
    const result = await fetch(
      `https://assignment-todolist-api.vercel.app/api/thbr/items`,
      {
        method: 'GET',
        cache: 'no-store',
      },
    );
    const res = await result.json();
    const yet = [];
    const already = [];
    for (let i = 0; i < res.length; i++) {
      if (res[i].isCompleted) {
        already.push({ ...res[i], memo: '', imageUrl: '', tenantId: userId });
      } else {
        yet.push({ ...res[i], memo: '', imageUrl: '', tenantId: userId });
      }
    }
    setTodos(yet);
    setDones(already);
    setNewTodo({ ...newTodo, name: '' });
  };

  useEffect(() => {
    getTodos();
  }, []);

  return (
    <div className="page">
      <div className="bar-line">
        <Bar setNewTodo={setNewTodo} newTodo={newTodo} func={getTodos} />
        <Button newTodo={newTodo} func={getTodos} type="add" />
        <SmallButton newTodo={newTodo} func={getTodos} type="add" />
      </div>
      <List todos={todos} dones={dones} func={getTodos} />
    </div>
  );
}
