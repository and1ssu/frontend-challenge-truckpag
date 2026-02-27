interface StarRatingInputProps {
  value: number;
  onChange: (value: number) => void;
}

export function StarRatingInput({ value, onChange }: StarRatingInputProps) {
  return (
    <div className="flex items-center gap-1" role="radiogroup" aria-label="Avaliação pessoal">
      {[1, 2, 3, 4, 5].map((star) => {
        const active = value >= star;

        return (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={active}
            className={`text-xl transition hover:scale-110 ${
              active ? 'text-[#e50914]' : 'text-zinc-500'
            }`}
            onClick={() => onChange(star)}
            title={`${star} estrela${star > 1 ? 's' : ''}`}
          >
            ★
          </button>
        );
      })}
    </div>
  );
}
