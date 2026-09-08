const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target1 = `  const handleDateChange = (newDate: string) => {
    setCurrentSession((prev) => ({ ...prev, date: newDate }));
  };`;

const repl1 = `  const handleDateChange = (newDate: string) => {
    setCurrentSession((prev) => ({ ...prev, date: newDate }));
  };

  const handleTimeChange = (newTime: string) => {
    setCurrentSession((prev) => {
      // newTime is "HH:mm". Update the startTime but preserve the Date if possible, or just set as HH:mm
      // Let's create a new Date string by taking the current date + new time
      const parts = newTime.split(':');
      if (parts.length === 2) {
        let d = new Date(prev.startTime);
        if (isNaN(d.getTime())) d = new Date();
        d.setHours(parseInt(parts[0], 10));
        d.setMinutes(parseInt(parts[1], 10));
        return { ...prev, startTime: d.toISOString() };
      }
      return { ...prev, startTime: newTime };
    });
  };`;

code = code.replace(target1, repl1);

const target2 = `      <WorkoutHeader
        session={currentSession}
        onSelectTemplate={handleSelectTemplate}
        templates={templates.map((t) => ({ id: t.id, title: t.title, tag: t.tag }))}
        onDateChange={handleDateChange}
        onFinishWorkout={handleFinishWorkout}`;

const repl2 = `      <WorkoutHeader
        session={currentSession}
        onSelectTemplate={handleSelectTemplate}
        templates={templates.map((t) => ({ id: t.id, title: t.title, tag: t.tag }))}
        onDateChange={handleDateChange}
        onTimeChange={handleTimeChange}
        onFinishWorkout={handleFinishWorkout}`;

code = code.replace(target2, repl2);

fs.writeFileSync('src/App.tsx', code);
