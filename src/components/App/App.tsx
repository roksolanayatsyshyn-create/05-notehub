import { useState } from 'react';

import { NoteList} from "../NoteList/NoteList";
import css from './App.module.css';
import { SearchBox } from "../SearchBox/SearchBox";
import { Pagination } from "../Pagination/Pagination";
import { useQuery, useQueryClient,keepPreviousData } from "@tanstack/react-query";
import { fetchNotes, createNote, deleteNote } from "../../services/noteService.ts";
import { Modal } from "../Modal/Modal";
import { NoteForm } from "../NoteForm/NoteForm";
import type { NoteFormValues  } from "../../types/note";
import { useDebounce } from "use-debounce";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Loader  from "../Loader/Loader";



const PER_PAGE = 12;
function App() {
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
const [debouncedSearch] = useDebounce(search, 500);

    
    
   const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", debouncedSearch, page],
    queryFn: () => fetchNotes(debouncedSearch, page, PER_PAGE),
    placeholderData: keepPreviousData,
  });


  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };


  const handleCreateNote = async (values: NoteFormValues) => {
  await createNote(values);
  setIsModalOpen(false);
  queryClient.invalidateQueries({ queryKey: ["notes"] });
  setIsModalOpen(false);

};


  const handleDeleteNote = async (id: string) => {
  await deleteNote(id);
  queryClient.invalidateQueries({ queryKey: ["notes"] });
};

  return (
    <>
      <div className={css.app}>
	<header className={css.toolbar}>
		{
      <SearchBox
          value={search}
          onChange={handleSearchChange}
        />
    }
    
		
  <Pagination
    totalPages={totalPages}
    currentPage={page}
    onPageChange={setPage}
  />


		{<button className={css.button}
    onClick={() => setIsModalOpen(true)}>Create note +</button>}




  </header>
  {isLoading&& <Loader/>}
  {isError && <ErrorMessage/>}
  {!isLoading && !isError && notes.length > 0 && (
        
        
          <NoteList notes={notes} onDelete={handleDeleteNote} />

          
        
      )}
{isModalOpen && (
  <Modal onClose={() => setIsModalOpen(false)}>
    <NoteForm
      onSubmit={handleCreateNote}
      onCancel={() => setIsModalOpen(false)}
    />
  </Modal>
)}

</div>

    </>
  )
}

export default App;
