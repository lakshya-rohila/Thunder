import React, { useEffect } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchCommunityFeed } from "./CommunityActions";
import { setSort, setPage } from "./CommunitySlice";
import { ComponentPreview, CopyButton } from "./CommunityComponents";

export default function CommunityFeed() {
  const dispatch = useAppDispatch();
  const { chats, loading, sort, page, totalPages } = useAppSelector(
    (state) => state.community,
  );

  useEffect(() => {
    dispatch(fetchCommunityFeed({ page, sort }));
  }, [dispatch, page, sort]);

  const handleSortChange = (newSort: "latest" | "likes") => {
    if (sort !== newSort) {
      dispatch(setSort(newSort));
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      dispatch(setPage(newPage));
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#050505]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl md:text-5xl font-black text-white mb-4 uppercase tracking-tight">
              Community <span className="text-[#DFFF00]">Showcase</span>
            </h1>
            <p className="text-[#A1A1AA] font-mono text-sm max-w-2xl">
              Discover components created by the Thunder community.
            </p>
          </div>

          <div className="flex bg-[#050505] p-1 border-2 border-white/10 gap-1">
            <button
              onClick={() => handleSortChange("latest")}
              className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all border-2 ${
                sort === "latest"
                  ? "bg-[#DFFF00] text-[#050505] border-[#DFFF00] shadow-[4px_4px_0_rgba(255,255,255,0.2)]"
                  : "text-[#A1A1AA] hover:text-[#FAFAFA] border-transparent hover:border-white/20 hover:bg-white/5"
              }`}
            >
              Latest
            </button>
            <button
              onClick={() => handleSortChange("likes")}
              className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all border-2 ${
                sort === "likes"
                  ? "bg-[#DFFF00] text-[#050505] border-[#DFFF00] shadow-[4px_4px_0_rgba(255,255,255,0.2)]"
                  : "text-[#A1A1AA] hover:text-[#FAFAFA] border-transparent hover:border-white/20 hover:bg-white/5"
              }`}
            >
              Most Liked
            </button>
          </div>
        </div>

        {loading && chats.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-[380px] bg-[#0A0A0A] border-2 border-white/10 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {chats.map((chat) => (
              <div
                key={chat._id}
                className="group bg-[#050505] border-2 border-white/10 overflow-hidden hover:border-[#DFFF00] transition-all flex flex-col h-[380px] hover:shadow-[8px_8px_0_rgba(223,255,0,0.2)] hover:-translate-y-1 hover:-translate-x-1"
              >
                {/* Preview Area */}
                <div className="h-[200px] bg-[#000000] relative overflow-hidden border-b-2 border-white/10 group-hover:border-[#DFFF00] transition-colors">
                  <div className="absolute inset-0 transform scale-75 origin-center opacity-90 transition-transform duration-500 group-hover:scale-100">
                    <ComponentPreview
                      html={chat.generatedHTML}
                      css={chat.generatedCSS}
                      js={chat.generatedJS}
                    />
                  </div>
                  <div className="absolute inset-0 bg-linear-to-t from-[#050505] via-transparent to-transparent opacity-50" />

                  <Link
                    href={`/community/${chat._id}`}
                    className="absolute inset-0 z-10"
                  />

                  <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                    <CopyButton
                      html={chat.generatedHTML}
                      css={chat.generatedCSS}
                      js={chat.generatedJS}
                    />
                  </div>
                </div>

                {/* Info Area */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <Link
                      href={`/community/${chat._id}`}
                      className="text-lg font-black uppercase tracking-widest text-[#FAFAFA] hover:text-[#DFFF00] transition-colors line-clamp-1"
                    >
                      {chat.title}
                    </Link>
                  </div>

                  <p className="text-sm text-[#A1A1AA] font-mono line-clamp-2 mb-4 flex-1">
                    {chat.description || "No description provided."}
                  </p>

                  <div className="flex items-center justify-between pt-6 border-t border-white/10 mt-auto">
                    <Link
                      href={`/profile/${chat.author.username || chat.author.name}`}
                      className="flex items-center gap-3 group/author"
                    >
                      <div className="w-8 h-8 border-2 border-white/20 bg-[#0A0A0A] flex items-center justify-center text-xs font-black text-[#FAFAFA] group-hover/author:border-[#DFFF00] group-hover/author:text-[#DFFF00] transition-all shadow-[2px_2px_0_rgba(255,255,255,0.1)] group-hover/author:shadow-[2px_2px_0_rgba(223,255,0,0.5)]">
                        {chat.author.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-[10px] font-bold font-mono tracking-widest uppercase text-[#A1A1AA] group-hover/author:text-[#FAFAFA] transition-colors">
                        {chat.author.name}
                      </span>
                    </Link>

                    <div className="flex items-center gap-4 text-[10px] font-bold font-mono text-[#A1A1AA]">
                      <div className="flex items-center gap-1.5">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="square"
                          strokeLinejoin="miter"
                        >
                          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                        </svg>
                        {chat.likesCount}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="square"
                          strokeLinejoin="miter"
                        >
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                        {chat.commentsCount}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-12 gap-4">
            <button
              disabled={page === 1}
              onClick={() => handlePageChange(page - 1)}
              className="px-4 py-2 border-2 border-white/20 bg-[#0A0A0A] text-[#FAFAFA] font-bold font-mono text-[10px] uppercase tracking-widest hover:border-[#DFFF00] hover:text-[#DFFF00] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Previous
            </button>
            <div className="flex items-center gap-2 px-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#A1A1AA]">
                Page <span className="text-white font-bold">{page}</span> of{" "}
                <span className="text-white font-bold">{totalPages}</span>
              </span>
            </div>
            <button
              disabled={page === totalPages}
              onClick={() => handlePageChange(page + 1)}
              className="px-4 py-2 border-2 border-white/20 bg-[#0A0A0A] text-[#FAFAFA] font-bold font-mono text-[10px] uppercase tracking-widest hover:border-[#DFFF00] hover:text-[#DFFF00] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
