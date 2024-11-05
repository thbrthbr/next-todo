// 범용 요소 컴포넌트

'use client';

import { useRouter } from 'next/navigation';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import checkIcon from '../asset/Vector 64.png';

interface Todo {
  id: number;
  imageUrl: string;
  isCompleted: boolean;
  memo: string;
  name: string;
  tenantId: string;
}

interface Props {
  id: number;
  name: Todo;
  setName: React.Dispatch<React.SetStateAction<Todo>>;
  status: string;
  isDetail: boolean;
  func: () => void;
}

export default function EachItem(props: Props) {
  const { id, name, setName, status, isDetail, func } = props;
  const [inputWidth, setInputWidth] = useState(20);
  const spanRef = useRef<HTMLSpanElement | null>(null);
  const router = useRouter();

  // 특정 아이템 세부사항으로 이동
  const goDetail = (id: number) => {
    if (!isDetail) router.push(`/items/${id}`);
  };

  // 할 일 제목 변경 함수
  const changeName = (event: ChangeEvent<HTMLInputElement>) => {
    setName({ ...name, name: event.target.value });
  };

  // 할 일 <-> 완료 전환
  const checkTodo = async (event: React.MouseEvent<HTMLElement>) => {
    if (!isDetail) {
      event.stopPropagation();
      await fetch(
        `https://assignment-todolist-api.vercel.app/api/thbr/items/${id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            isCompleted: !name.isCompleted,
          }),
          cache: 'no-store',
        },
      );
      func();
    } else {
      setName({ ...name, isCompleted: !name.isCompleted });
    }
  };

  // 할 일의 제목 input창 자동사이징용 코드
  useEffect(() => {
    if (spanRef.current) {
      const width = spanRef.current.offsetWidth;
      setInputWidth(width + 10);
    }
  }, [name.name]);

  return (
    <div
      key={id}
      className={`each-item ${isDetail && 'detail-page-formation'}`}
      style={{ backgroundColor: status == 'yet' ? '#FFFFFF' : '#EDE9FE' }}
      onClick={() => {
        goDetail(id);
      }}
    >
      <div
        onClick={checkTodo}
        className="circle"
        style={{ backgroundColor: status == 'yet' ? '#FEFCE8' : '#7C3AED' }}
      >
        {status == 'already' && <img src={checkIcon.src} />}
      </div>
      {isDetail ? (
        <input
          spellCheck={false}
          style={{
            maxWidth: '80%',
            width: `${inputWidth}px`,
            minWidth: '20px',
            padding: '5px',
            boxSizing: 'content-box',
          }}
          className="detail-page-name-input"
          value={name.name}
          onChange={changeName}
        ></input>
      ) : (
        <span
          style={{
            textDecoration: status == 'already' ? 'line-through' : 'none',
          }}
        >
          {name.name}
        </span>
      )}
      <span
        ref={spanRef}
        style={{
          position: 'absolute',
          visibility: 'hidden',
          whiteSpace: 'pre',
          font: 'inherit',
        }}
      >
        {name.name || ' '}
      </span>
    </div>
  );
}
