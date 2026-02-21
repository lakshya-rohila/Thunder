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
    <div className="flex-1 overflow-y-auto bg-[#0B0F19]">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Community <span className="text-[#00F5FF]">Showcase</span>
            </h1>
            <p className="text-[#8B9AB5]">
              Discover components created by the Thunder community.
            </p>
          </div>

          <div className="flex bg-[#161B22] p-1 rounded-lg border border-white/5">
            <button
              onClick={() => handleSortChange("latest")}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${
                sort === "latest"
                  ? "bg-[#00F5FF]/10 text-[#00F5FF] shadow-[0_0_10px_rgba(0,245,255,0.1)]"
                  : "text-[#6B7A99] hover:text-white"
              }`}
            >
              Latest
            </button>
            <button
              onClick={() => handleSortChange("likes")}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${
                sort === "likes"
                  ? "bg-[#00F5FF]/10 text-[#00F5FF] shadow-[0_0_10px_rgba(0,245,255,0.1)]"
                  : "text-[#6B7A99] hover:text-white"
              }`}
            >
              Most Liked
            </button>
          </div>
        </div>

        {/* Grid */}
        {loading && chats.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-[320px] rounded-xl bg-[#161B22] border border-white/5 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {chats.map((chat) => (
              <div
                key={chat._id}
                className="group bg-[#161B22] rounded-xl border border-white/5 overflow-hidden hover:border-[#00F5FF]/30 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,245,255,0.05)] flex flex-col h-[380px]"
              >
                {/* Preview Area */}
                <div className="h-[200px] bg-[#0B0F19] relative overflow-hidden border-b border-white/5 group-hover:border-[#00F5FF]/10 transition-colors">
                  <div className="absolute inset-0 transform scale-75 origin-center opacity-90 transition-transform duration-500 group-hover:scale-100">
                    <ComponentPreview
                      html={chat.generatedHTML}
                      css={chat.generatedCSS}
                      js={chat.generatedJS}
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#161B22] via-transparent to-transparent opacity-50" />
                  
                  <Link
                    href={`/community/${chat._id}`}
                    className="absolute inset-0 z-10"
                  />
                  
                  <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                    <CopyButton
                      html={chat.generatedHTML}
                      css={chat.generatedCSS}
                      js={chat.generatedJS}
                    />
                  </div>
                </div>

                {/* Info Area */}
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <Link
                      href={`/community/${chat._id}`}
                      className="text-lg font-bold text-white hover:text-[#00F5FF] transition-colors line-clamp-1"
                    >
                      {chat.title}
                    </Link>
                  </div>

                  <p className="text-sm text-[#8B9AB5] line-clamp-2 mb-4 flex-1">
                    {chat.description || "No description provided."}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
                    <Link
                      href={`/profile/${chat.author.username || chat.author.name}`}
                      className="flex items-center gap-2 group/author"
                    >
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#00F5FF]/20 to-[#8A2BE2]/20 flex items-center justify-center text-[10px] font-bold text-white border border-white/10 group-hover/author:border-[#00F5FF]/30 transition-colors">
                        {chat.author.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-xs text-[#8B9AB5] group-hover/author:text-white transition-colors">
                        {chat.author.name}
                      </span>
                    </Link>

                    <div className="flex items-center gap-4 text-xs text-[#6B7A99]">
                      <div className="flex items-center gap-1.5">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
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
                          strokeLinecap="round"
                          strokeLinejoin="round"
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
          <div className="flex justify-center mt-12 gap-2">
            <button
              disabled={page === 1}
              onClick={() => handlePageChange(page - 1)}
              className="px-4 py-2 rounded-lg bg-[#161B22] border border-white/5 text-[#8B9AB5] hover:text-white hover:border-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Previous
            </button>
            <div className="flex items-center gap-2 px-4">
              <span className="text-sm text-[#8B9AB5]">
                Page <span className="text-white font-bold">{page}</span> of{" "}
                <span className="text-white font-bold">{totalPages}</span>
              </span>
            </div>
            <button
              disabled={page === totalPages}
              onClick={() => handlePageChange(page + 1)}
              className="px-4 py-2 rounded-lg bg-[#161B22] border border-white/5 text-[#8B9AB5] hover:text-white hover:border-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
