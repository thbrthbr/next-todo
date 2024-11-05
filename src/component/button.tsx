// 재사용 범용 버튼 컴포넌트

'use client';

import { useEffect, useRef, useState } from 'react';
import plusIcon from '../asset/Frame 2610256.png';
import checkIcon from '../asset/check.png';
import xIcon from '../asset/X.png';

interface Todo {
  id: number;
  imageUrl: string;
  isCompleted: boolean;
  memo: string;
  name: string;
  tenantId: string;
}

interface Props {
  newTodo: Todo;
  func: () => void;
  type: string;
}

export default function Button(props: Props) {
  const activateRef = useRef<HTMLButtonElement>(null);
  const isMounted = useRef(false);
  const [typeText, setTypeText] = useState('');
  const [typeIcon, setTypeIcon] = useState(plusIcon.src);
  const [original, setOriginal] = useState('');
  const { newTodo, func, type } = props;

  // props로 받는 타입에 따라 다른 기능을 수행
  const chooseFunction = () => {
    if (type == 'add') addTodo();
    if (type == 'edit') editTodo();
    if (type == 'delete') deleteTodo();
  };

  // 할 일 추가 post요청
  const addTodo = async () => {
    if (newTodo.name) {
      await fetch(`https://assignment-todolist-api.vercel.app/api/thbr/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newTodo.name }),
        cache: 'no-store',
      });
      func();
    } else {
      alert('할 일을 입력해주세요!');
    }
  };

  // 특정 할 일 세부사항 수정 patch요청
  const editTodo = async () => {
    await fetch(
      `https://assignment-todolist-api.vercel.app/api/thbr/items/${newTodo.id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newTodo.name,
          memo: newTodo.memo,
          imageUrl: newTodo.imageUrl,
          isCompleted: newTodo.isCompleted,
        }),
        cache: 'no-store',
      },
    );
    func();
  };

  // 할 일 삭제 delete요청
  const deleteTodo = async () => {
    await fetch(
      `https://assignment-todolist-api.vercel.app/api/thbr/items/${newTodo.id}`,
      {
        method: 'DELETE',
        cache: 'no-store',
      },
    );
    func();
  };

  // 변화가 감지되었을 때 버튼색 변하는 함수
  const detectActivate = () => {
    if (activateRef.current) {
      if (type == 'edit') {
        if (original && JSON.parse(original).id !== -1) {
          if (JSON.stringify(newTodo) !== original) {
            activateRef.current.style.backgroundColor = '#BEF264';
          }
        }
      }
    }
  };

  // 첫 렌더링 때 버튼의 모양을 결정할 state 관리
  useEffect(() => {
    if (type == 'add') {
      setTypeText('추가하기');
      setTypeIcon(plusIcon.src);
    }
    if (type == 'edit') {
      setTypeText('수정 완료');
      setTypeIcon(checkIcon.src);
    }
    if (type == 'delete') {
      setTypeText('삭제하기');
      setTypeIcon(xIcon.src);
    }
  }, []);

  // 처음 받아왔을 때의 데이터와 다른지 체크하기 위한 코드
  useEffect(() => {
    setOriginal(JSON.stringify(newTodo));
    if (isMounted.current) {
      detectActivate();
    } else {
      isMounted.current = true;
    }
  }, [newTodo]);

  return (
    <button
      ref={activateRef}
      className={`button ${type == 'add' && 'add-button'} ${
        type == 'edit' && 'edit-button'
      } ${type == 'delete' && 'delete-button'}`}
      onClick={chooseFunction}
    >
      <img className="button-icon" src={typeIcon} />
      &nbsp;
      <div>{typeText}</div>
    </button>
  );
}
