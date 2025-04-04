import datetime

def special_log(route: str, description: str, user_id: int = None, token_id: int = None, email: str = None):
    current_time = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    with open('special-log.txt', 'a') as log_file:
        if user_id and token_id:
            log_file.write(f"{current_time} | {route} | {user_id} | {token_id} | {description}\n")
        elif email:
            log_file.write(f"{current_time} | {route} | {email} | {description}\n")
        else:
            log_file.write(f"{current_time} | {route} | NO USER | {description}\n")