import React from "react";
import Toggle from "react-toggle";
import useDarkMode from "use-dark-mode";

export const DarkModeToggle = (): JSX.Element => {
  const { toggle,value } = useDarkMode(false);
  return (
    <label className="flex">
      <Toggle
        defaultChecked={value}
        icons={false}
        onChange={toggle}
      />
      <span className="ml-2">Dark Mode</span>
    </label>
  );
};
