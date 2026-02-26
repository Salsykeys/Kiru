import { create }   from 'zustand';

export const useStore = create ((set)=> ({

    theme: localStorage.getItem('theme')|| 'light',

    changeTheme: () =>{

        set((state)=>{

            const newTheme = state.theme === 'light' ? 'dark' : 'light';

            localStorage.setItem('theme', newTheme);
            document.documentElement.setAttribute('data-bs-theme', newTheme);

            return { theme: newTheme };
        });
    },  

}));