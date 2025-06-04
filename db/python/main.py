from iso3166 import countries

count = 0
with open("../execute_queries/data - countries.sql", "w", encoding="utf-8") as f:

    for country in countries:
        count += 1
        name = country.name.replace("'", "\\'")
        f.write(
            f"""
INSERT INTO countries (iso3166_numeric, name, alpha2) 
VALUES ({country.numeric}, '{name}', '{country.alpha2}')
ON DUPLICATE KEY UPDATE name = VALUES(name);
"""
        )

print("SQL file generated: countries.sql\nNumber of countries:", count)
