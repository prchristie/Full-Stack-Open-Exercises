export const Course = ({ course }) => (
  <>
    <CourseHeader course={course.name} />
    <Content parts={course.parts} />

    <Total
      total={course.parts.reduce((sum, part) => sum + part.exercises, 0)}
    />
  </>
);

const CourseHeader = ({ course }) => <h2>{course}</h2>;

const Content = ({ parts }) => (
  <>
    {parts.map((part) => (
      <Part key={part.id} part={part} />
    ))}
  </>
);

const Part = ({ part }) => (
  <>
    <p>
      {part.name} {part.exercises}
    </p>
  </>
);

const Total = ({ total }) => <b>total of {total} exercises</b>;
