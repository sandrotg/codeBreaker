#!/usr/bin/env python3
"""
Solución de ejemplo para CodeBreaker
Este archivo lee datos de la entrada estándar y escribe el resultado.
"""

def main():
    # Leer entrada
    try:
        # Leer todas las líneas de entrada
        data = input().strip()
        
        # Procesar datos (ejemplo: sumar dos números)
        # Puedes modificar esta lógica según el problema
        numbers = list(map(int, data.split()))
        result = sum(numbers)
        
        # Imprimir resultado
        print(result)
    except EOFError:
        pass
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)


if __name__ == "__main__":
    import sys
    main()


