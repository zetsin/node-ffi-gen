typedef struct a a;
typedef struct b b;

struct a
{
	b *xx;
};

struct b
{
	a *yy;
	uint8_t c;
};
