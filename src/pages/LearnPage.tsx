import { useMemo, useState } from "react";
import { LessonCard } from "../components/LessonCard";
import { lessons } from "../lib/lessons";
import { getUserProgress, markLessonCompleted } from "../lib/storage";

export function LearnPage() {
  const [version, setVersion] = useState(0);
  const progress = useMemo(() => getUserProgress(), [version]);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <span className="kicker">Fondamentali interattivi</span>
          <h1 className="page-title">Impara</h1>
        </div>
        <span className="badge badge-Good">{progress.completedLessons.length}/{lessons.length}</span>
      </div>
      <div className="lesson-grid grid">
        {lessons.map((lesson) => (
          <LessonCard
            key={lesson.id}
            lesson={lesson}
            completed={progress.completedLessons.includes(lesson.id)}
            onComplete={() => {
              markLessonCompleted(lesson.id);
              setVersion((value) => value + 1);
            }}
          />
        ))}
      </div>
    </div>
  );
}
