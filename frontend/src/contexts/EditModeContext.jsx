import React, { createContext, useContext, useState, useCallback } from "react";

const EditModeContext = createContext({
  editMode: false,
  toggle: () => {},
});

export const EditModeProvider = ({ children }) => {
  const [editMode, setEditMode] = useState(false);
  const toggle = useCallback(() => setEditMode((p) => !p), []);
  return (
    <EditModeContext.Provider value={{ editMode, toggle }}>
      {children}
    </EditModeContext.Provider>
  );
};

export const useEditMode = () => useContext(EditModeContext);

export default EditModeContext;
