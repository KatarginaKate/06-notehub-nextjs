"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";

import css from "./NotesPage.module.css";

import SearchBox from "@/app/notes/SearchBox/SearchBox";
import Pagination from "@/app/notes/Pagination/Pagination";
import NoteList from "@/app/notes/NoteList/NoteList"    ;
import Modal from "@/app/notes/Modal/Modal";
import NoteForm from "@/app/notes/NoteForm/NoteForm"    ;

import { fetchNotes } from "../../lib/api";

function App() {

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", page, search],
    queryFn: () =>
      fetchNotes({
        page,
        perPage: 12,
        search,
      }),
      placeholderData: (prev) => prev,
  });

  const handleSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, 500);

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onSearch={handleSearch} />

        {data && data.totalPages > 1 && (
          <Pagination
            totalPages={data.totalPages}
            currentPage={page}
            onPageChange={handlePageChange}
          />
        )}

        <button className={css.button} onClick={() => setIsOpen(true)}>
          Create note +
        </button>
      </header>

      {isLoading && <p>Loading...</p>}
      {isError && <p>Error loading notes</p>}

      {data && data.notes.length > 0 && (
        <NoteList
          notes={data.notes}
        />
      )}

      {isOpen && (
        <Modal onClose={() => setIsOpen(false)}>
          <NoteForm
            onClose={() => setIsOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
}

export default App;